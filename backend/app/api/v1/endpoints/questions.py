from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from app import schemas, models
from app.database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.QuestionWithOptions])
def get_questions(
    topic_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100),
    shuffle: bool = False,
    db: Session = Depends(get_db)
):
    """
    Get questions with options (without revealing correct answers).
    Supports filtering by topic, subject, difficulty.
    """
    query = db.query(models.Question)

    if topic_id:
        query = query.filter(models.Question.topic_id == topic_id)

    if subject_id:
        # Get all topic IDs for this subject
        topic_ids = db.query(models.Topic.id).filter(models.Topic.subject_id == subject_id).all()
        topic_ids = [t[0] for t in topic_ids]
        if topic_ids:
            query = query.filter(models.Question.topic_id.in_(topic_ids))
        else:
            return []

    if difficulty:
        query = query.filter(models.Question.difficulty == difficulty)

    if shuffle:
        # Get all matching questions and shuffle
        questions = query.all()
        random.shuffle(questions)
        questions = questions[:limit]
    else:
        questions = query.limit(limit).all()

    result = []
    for q in questions:
        options = db.query(models.QuestionOption).filter(
            models.QuestionOption.question_id == q.id
        ).all()
        result.append(schemas.QuestionWithOptions(
            id=q.id,
            topic_id=q.topic_id,
            question_text=q.question_text,
            difficulty=q.difficulty,
            marks=q.marks,
            options=[schemas.QuestionOptionResponse(
                id=opt.id,
                option_text=opt.option_text,
                option_label=opt.option_label
            ) for opt in options]
        ))

    return result


@router.get("/{question_id}", response_model=schemas.QuestionDetail)
def get_question_detail(
    question_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single question with all details including correct answer and explanation.
    This should only be used for review after submission, not for practice.
    """
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    options = db.query(models.QuestionOption).filter(
        models.QuestionOption.question_id == question.id
    ).all()

    correct_option = next((opt.option_label for opt in options if opt.is_correct), None)

    return schemas.QuestionDetail(
        id=question.id,
        topic_id=question.topic_id,
        question_text=question.question_text,
        difficulty=question.difficulty,
        marks=question.marks,
        options=[schemas.QuestionOptionResponse(
            id=opt.id,
            option_text=opt.option_text,
            option_label=opt.option_label
        ) for opt in options],
        explanation=question.explanation,
        correct_option=correct_option
    )


@router.post("/submit", response_model=schemas.AnswerResult)
def submit_answer(
    answer: schemas.AnswerSubmission,
    db: Session = Depends(get_db)
):
    """
    Submit an answer for a question and get the result.
    Returns whether the answer is correct, the correct option, and explanation.
    """
    question = db.query(models.Question).filter(models.Question.id == answer.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Get correct option
    correct_option_obj = db.query(models.QuestionOption).filter(
        models.QuestionOption.question_id == question.id,
        models.QuestionOption.is_correct == 1
    ).first()

    if not correct_option_obj:
        raise HTTPException(status_code=500, detail="Question has no correct answer configured")

    is_correct = answer.selected_option == correct_option_obj.option_label

    return schemas.AnswerResult(
        question_id=question.id,
        is_correct=is_correct,
        correct_option=correct_option_obj.option_label,
        explanation=question.explanation,
        selected_option=answer.selected_option,
        time_taken_seconds=answer.time_taken_seconds
    )