from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models
from app.database import get_db
from app.auth import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[schemas.TopicResponse])
def get_topics(
    skip: int = 0,
    limit: int = 100,
    chapter_id: int = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve topics (optionally filtered by chapter_id).
    """
    query = db.query(models.Topic)
    if chapter_id:
        query = query.filter(models.Topic.chapter_id == chapter_id)

    topics = query.offset(skip).limit(limit).all()
    return topics

@router.post("/", response_model=schemas.TopicResponse)
def create_topic(
    topic_in: schemas.TopicCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Create a new topic (Admin only).
    """
    topic = models.Topic(**topic_in.model_dump())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic

@router.put("/{topic_id}", response_model=schemas.TopicResponse)
def update_topic(
    topic_id: int,
    topic_in: schemas.TopicUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Update a topic (Admin only).
    """
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    update_data = topic_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(topic, field, value)

    db.commit()
    db.refresh(topic)
    return topic

@router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Delete a topic (Admin only).
    """
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    db.delete(topic)
    db.commit()
    return None

@router.get("/{topic_id}", response_model=schemas.TopicResponse)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    """
    Retrieve specific topic by ID.
    """
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic
