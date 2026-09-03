import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.question import Question, QuestionOption
from app.models.topic import Topic
from app.pipeline.pdf_extractor import QuestionSchema

logger = logging.getLogger(__name__)

class DatabaseImporter:
    def __init__(self, db_session: Session):
        self.db = db_session

    def ensure_topic(self, topic_id: int):
        """Verify the topic exists."""
        topic = self.db.query(Topic).filter(Topic.id == topic_id).first()
        if not topic:
            raise ValueError(f"Topic with ID {topic_id} does not exist.")
        return topic

    def import_questions(self, questions: List[QuestionSchema], topic_id: int, dry_run: bool = False) -> Dict[str, Any]:
        """
        Import validated questions into the database.
        Maps the Pydantic schema to SQLAlchemy models.
        """
        self.ensure_topic(topic_id)

        stats = {
            "total_attempted": len(questions),
            "successfully_imported": 0,
            "skipped_duplicates": 0,
            "errors": 0
        }

        # Fast duplicate checking in memory via a set of question texts for this topic
        existing_q_texts = set(
            q[0] for q in self.db.query(Question.question_text).filter(Question.topic_id == topic_id).all()
        )

        for q_data in questions:
            # Check for duplicates
            if q_data.question_text in existing_q_texts:
                logger.debug(f"Skipping duplicate question: {q_data.question_text[:30]}...")
                stats["skipped_duplicates"] += 1
                continue

            try:
                # 1. Create Question
                new_question = Question(
                    topic_id=topic_id,
                    question_text=q_data.question_text,
                    explanation=q_data.explanation,
                    is_pyq=q_data.is_pyq,
                    year=q_data.year,
                    shift=q_data.shift,
                    source=q_data.source,
                    marks=q_data.marks,
                    difficulty=q_data.difficulty
                )

                self.db.add(new_question)
                self.db.flush() # Flush to get the new_question.id

                # 2. Create Options
                options_to_add = []
                for opt_data in q_data.options:
                    is_correct = 1 if opt_data.label == q_data.correct_option else 0
                    new_option = QuestionOption(
                        question_id=new_question.id,
                        option_label=opt_data.label,
                        option_text=opt_data.text,
                        is_correct=is_correct
                    )
                    options_to_add.append(new_option)

                self.db.add_all(options_to_add)
                existing_q_texts.add(q_data.question_text)
                stats["successfully_imported"] += 1

            except Exception as e:
                logger.error(f"Error importing question: {e}")
                self.db.rollback()
                stats["errors"] += 1

        if not dry_run:
            try:
                self.db.commit()
                logger.info(f"Successfully committed {stats['successfully_imported']} questions to DB.")
            except Exception as e:
                logger.error(f"Commit failed: {e}")
                self.db.rollback()
                stats["errors"] += stats["successfully_imported"]
                stats["successfully_imported"] = 0
        else:
            self.db.rollback()
            logger.info("Dry run completed. Rolled back changes.")

        return stats
