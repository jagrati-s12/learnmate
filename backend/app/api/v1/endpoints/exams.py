from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models
from app.database import get_db
from app.auth import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Exam])
def get_exams(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all exams.
    """
    exams = db.query(models.Exam).offset(skip).limit(limit).all()
    return exams

@router.post("/", response_model=schemas.Exam)
def create_exam(
    exam_in: schemas.ExamCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Create a new exam (Admin only).
    """
    exam = models.Exam(**exam_in.model_dump())
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam

@router.put("/{exam_id}", response_model=schemas.Exam)
def update_exam(
    exam_id: int,
    exam_in: schemas.ExamUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Update an exam (Admin only).
    """
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    update_data = exam_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exam, field, value)

    db.commit()
    db.refresh(exam)
    return exam

@router.delete("/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Delete an exam (Admin only).
    """
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    db.delete(exam)
    db.commit()
    return None

@router.get("/{exam_id}", response_model=schemas.Exam)
def get_exam(exam_id: int, db: Session = Depends(get_db)):
    """
    Retrieve specific exam by ID.
    """
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.get("/{exam_id}/branches", response_model=List[schemas.Branch])
def get_branches_for_exam(
    exam_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve branches for a specific exam.
    """
    if not db.query(models.Exam).filter(models.Exam.id == exam_id).first():
        raise HTTPException(status_code=404, detail="Exam not found")

    branches = db.query(models.Branch).filter(models.Branch.exam_id == exam_id).offset(skip).limit(limit).all()
    return branches
