from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models
from app.database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.SubjectWithTopics])
def get_subjects_with_topics(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all subjects with their topics and question counts.
    """
    subjects = db.query(models.Subject).offset(skip).limit(limit).all()

    result = []
    for subject in subjects:
        # Get topics with question count for each subject
        topics = db.query(models.Topic).filter(models.Topic.subject_id == subject.id).all()
        topic_list = []

        for topic in topics:
            question_count = db.query(models.Question).filter(models.Question.topic_id == topic.id).count()
            topic_list.append(schemas.TopicWithQuestionCount(
                id=topic.id,
                subject_id=topic.subject_id,
                name=topic.name,
                description=topic.description,
                display_order=topic.display_order,
                question_count=question_count
            ))

        result.append(schemas.SubjectWithTopics(
            id=subject.id,
            name=subject.name,
            description=subject.description,
            icon=subject.icon,
            display_order=subject.display_order,
            topics=topic_list
        ))

    return result


@router.get("/{subject_id}", response_model=schemas.SubjectWithTopics)
def get_subject_by_id(
    subject_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific subject by ID with its topics.
    """
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    # Get topics with question count
    topics = db.query(models.Topic).filter(models.Topic.subject_id == subject.id).all()
    topic_list = []

    for topic in topics:
        question_count = db.query(models.Question).filter(models.Question.topic_id == topic.id).count()
        topic_list.append(schemas.TopicWithQuestionCount(
            id=topic.id,
            subject_id=topic.subject_id,
            name=topic.name,
            description=topic.description,
            display_order=topic.display_order,
            question_count=question_count
        ))

    return schemas.SubjectWithTopics(
        id=subject.id,
        name=subject.name,
        description=subject.description,
        icon=subject.icon,
        display_order=subject.display_order,
        topics=topic_list
    )