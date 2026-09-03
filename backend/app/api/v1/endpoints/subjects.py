from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models
from app.database import get_db
from app.auth import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[schemas.SubjectWithTopics])
def get_subjects_with_topics(
    skip: int = 0,
    limit: int = 100,
    branch_id: int = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve all subjects with their chapters and topics.
    Optionally filter by branch_id.
    """
    query = db.query(models.Subject)
    if branch_id:
        query = query.filter(models.Subject.branch_id == branch_id)

    subjects = query.offset(skip).limit(limit).all()

    result = []
    for subject in subjects:
        chapters = db.query(models.Chapter).filter(models.Chapter.subject_id == subject.id).order_by(models.Chapter.display_order).all()
        chapter_list = []

        for chapter in chapters:
            topics = db.query(models.Topic).filter(models.Topic.chapter_id == chapter.id).order_by(models.Topic.display_order).all()
            topic_list = []

            for topic in topics:
                question_count = db.query(models.Question).filter(models.Question.topic_id == topic.id).count()
                topic_list.append(schemas.TopicSimple(
                    id=topic.id,
                    chapter_id=topic.chapter_id,
                    name=topic.name,
                    description=topic.description,
                    display_order=topic.display_order,
                    question_count=question_count
                ))

            chapter_list.append(schemas.ChapterWithTopics(
                id=chapter.id,
                subject_id=chapter.subject_id,
                name=chapter.name,
                description=chapter.description,
                display_order=chapter.display_order,
                topics=topic_list
            ))

        result.append(schemas.SubjectWithTopics(
            id=subject.id,
            branch_id=subject.branch_id,
            name=subject.name,
            description=subject.description,
            icon=subject.icon,
            display_order=subject.display_order,
            chapters=chapter_list
        ))

    return result

@router.post("/", response_model=schemas.SubjectResponse)
def create_subject(
    subject_in: schemas.SubjectCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Create a new subject (Admin only).
    """
    subject = models.Subject(**subject_in.model_dump())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject

@router.put("/{subject_id}", response_model=schemas.SubjectResponse)
def update_subject(
    subject_id: int,
    subject_in: schemas.SubjectUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Update a subject (Admin only).
    """
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    update_data = subject_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(subject, field, value)

    db.commit()
    db.refresh(subject)
    return subject

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Delete a subject (Admin only).
    """
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.delete(subject)
    db.commit()
    return None

@router.get("/{subject_id}", response_model=schemas.SubjectWithTopics)
def get_subject_by_id(
    subject_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific subject by ID with its chapters and topics.
    """
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    chapters = db.query(models.Chapter).filter(models.Chapter.subject_id == subject.id).order_by(models.Chapter.display_order).all()
    chapter_list = []

    for chapter in chapters:
        topics = db.query(models.Topic).filter(models.Topic.chapter_id == chapter.id).order_by(models.Topic.display_order).all()
        topic_list = []

        for topic in topics:
            question_count = db.query(models.Question).filter(models.Question.topic_id == topic.id).count()
            topic_list.append(schemas.TopicSimple(
                id=topic.id,
                chapter_id=topic.chapter_id,
                name=topic.name,
                description=topic.description,
                display_order=topic.display_order,
                question_count=question_count
            ))

        chapter_list.append(schemas.ChapterWithTopics(
            id=chapter.id,
            subject_id=chapter.subject_id,
            name=chapter.name,
            description=chapter.description,
            display_order=chapter.display_order,
            topics=topic_list
        ))

    return schemas.SubjectWithTopics(
        id=subject.id,
        branch_id=subject.branch_id,
        name=subject.name,
        description=subject.description,
        icon=subject.icon,
        display_order=subject.display_order,
        chapters=chapter_list
    )
