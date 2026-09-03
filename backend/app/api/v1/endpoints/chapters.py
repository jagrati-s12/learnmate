from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models
from app.database import get_db
from app.auth import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Chapter])
def get_chapters(
    skip: int = 0,
    limit: int = 100,
    subject_id: int = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve chapters (optionally filtered by subject_id).
    """
    query = db.query(models.Chapter)
    if subject_id:
        query = query.filter(models.Chapter.subject_id == subject_id)

    chapters = query.offset(skip).limit(limit).all()
    return chapters

@router.post("/", response_model=schemas.Chapter)
def create_chapter(
    chapter_in: schemas.ChapterCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Create a new chapter (Admin only).
    """
    chapter = models.Chapter(**chapter_in.model_dump())
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter

@router.put("/{chapter_id}", response_model=schemas.Chapter)
def update_chapter(
    chapter_id: int,
    chapter_in: schemas.ChapterUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Update a chapter (Admin only).
    """
    chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    update_data = chapter_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(chapter, field, value)

    db.commit()
    db.refresh(chapter)
    return chapter

@router.delete("/{chapter_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chapter(
    chapter_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Delete a chapter (Admin only).
    """
    chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    db.delete(chapter)
    db.commit()
    return None

@router.get("/{chapter_id}", response_model=schemas.Chapter)
def get_chapter(chapter_id: int, db: Session = Depends(get_db)):
    """
    Retrieve specific chapter by ID.
    """
    chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return chapter
