from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from app import schemas, models
from app.database import get_db
from app.auth import get_current_admin_user


router = APIRouter()

@router.get("/", response_model=List[schemas.QuestionWithOptions])
def get_questions(
    topic_id: Optional[int] = None,
    chapter_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    branch_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    is_pyq: Optional[bool] = None,
    limit: int = Query(10, ge=1, le=100),
    shuffle: bool = False,
    db: Session = Depends(get_db)
):
    """
    Get questions with options (without revealing correct answers).
    Supports filtering by topic, chapter, subject, branch, difficulty, pyq status.
    """
    query = db.query(models.Question)

    if topic_id:
        query = query.filter(models.Question.topic_id == topic_id)
    elif chapter_id:
        topic_ids = [t.id for t in db.query(models.Topic.id).filter(models.Topic.chapter_id == chapter_id).all()]
        query = query.filter(models.Question.topic_id.in_(topic_ids if topic_ids else [-1]))
    elif subject_id:
        chapter_ids = [c.id for c in db.query(models.Chapter.id).filter(models.Chapter.subject_id == subject_id).all()]
        topic_ids = [t.id for t in db.query(models.Topic.id).filter(models.Topic.chapter_id.in_(chapter_ids if chapter_ids else [-1])).all()]
        query = query.filter(models.Question.topic_id.in_(topic_ids if topic_ids else [-1]))
    elif branch_id:
        subject_ids = [s.id for s in db.query(models.Subject.id).filter(models.Subject.branch_id == branch_id).all()]
        chapter_ids = [c.id for c in db.query(models.Chapter.id).filter(models.Chapter.subject_id.in_(subject_ids if subject_ids else [-1])).all()]
        topic_ids = [t.id for t in db.query(models.Topic.id).filter(models.Topic.chapter_id.in_(chapter_ids if chapter_ids else [-1])).all()]
        query = query.filter(models.Question.topic_id.in_(topic_ids if topic_ids else [-1]))

    if difficulty:
        query = query.filter(models.Question.difficulty == difficulty)

    if is_pyq is not None:
        query = query.filter(models.Question.is_pyq == is_pyq)

    if shuffle:
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
            is_pyq=bool(q.is_pyq),
            year=q.year,
            shift=q.shift,
            source=q.source,
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
        is_pyq=bool(question.is_pyq),
        year=question.year,
        shift=question.shift,
        source=question.source,
        options=[schemas.QuestionOptionResponse(
            id=opt.id,
            option_text=opt.option_text,
            option_label=opt.option_label
        ) for opt in options],
        explanation=question.explanation,
        correct_option=correct_option or ""
    )

@router.post("/submit", response_model=schemas.AnswerResult)
def submit_answer(
    answer: schemas.AnswerSubmission,
    db: Session = Depends(get_db)
):
    """
    Submit an answer for a question and get the result.
    """
    question = db.query(models.Question).filter(models.Question.id == answer.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

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

@router.post("/", response_model=schemas.QuestionDetail)
def create_question(
    question_in: schemas.QuestionCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Create a new question with options (Admin only).
    """
    # Create the question
    question_data = question_in.model_dump(exclude={"options"})
    question = models.Question(**question_data)
    db.add(question)
    db.commit()
    db.refresh(question)

    # Create the options
    for opt in question_in.options:
        option = models.QuestionOption(
            question_id=question.id,
            **opt.model_dump()
        )
        db.add(option)
    
    db.commit()
    
    return get_question_detail(question.id, db)

@router.put("/{question_id}", response_model=schemas.QuestionDetail)
def update_question(
    question_id: int,
    question_in: schemas.QuestionUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Update a question and its options (Admin only).
    """
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    update_data = question_in.model_dump(exclude={"options"}, exclude_unset=True)
    for field, value in update_data.items():
        setattr(question, field, value)
        
    if question_in.options is not None:
        # Delete old options
        db.query(models.QuestionOption).filter(models.QuestionOption.question_id == question_id).delete()
        # Add new options
        for opt in question_in.options:
            option = models.QuestionOption(
                question_id=question.id,
                **opt.model_dump()
            )
            db.add(option)
            
    db.commit()
    return get_question_detail(question.id, db)
    
@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Delete a question (Admin only).
    """
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(question)
    db.commit()
    return None
