from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models
from app.database import get_db
from app.auth import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Branch])
def get_branches(
    skip: int = 0,
    limit: int = 100,
    exam_id: int = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve branches (optionally filtered by exam_id).
    """
    query = db.query(models.Branch)
    if exam_id:
        query = query.filter(models.Branch.exam_id == exam_id)

    branches = query.offset(skip).limit(limit).all()
    return branches

@router.post("/", response_model=schemas.Branch)
def create_branch(
    branch_in: schemas.BranchCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Create a new branch (Admin only).
    """
    branch = models.Branch(**branch_in.model_dump())
    db.add(branch)
    db.commit()
    db.refresh(branch)
    return branch

@router.put("/{branch_id}", response_model=schemas.Branch)
def update_branch(
    branch_id: int,
    branch_in: schemas.BranchUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Update a branch (Admin only).
    """
    branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    update_data = branch_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(branch, field, value)

    db.commit()
    db.refresh(branch)
    return branch

@router.delete("/{branch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_branch(
    branch_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    """
    Delete a branch (Admin only).
    """
    branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    db.delete(branch)
    db.commit()
    return None

@router.get("/{branch_id}", response_model=schemas.Branch)
def get_branch(branch_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific branch by ID.
    """
    branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch
