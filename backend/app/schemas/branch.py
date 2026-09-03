from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .exam import Exam

class BranchBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True
    display_order: int = 0

class BranchCreate(BranchBase):
    exam_id: int

class BranchUpdate(BranchBase):
    name: Optional[str] = None
    exam_id: Optional[int] = None

class BranchInDBBase(BranchBase):
    id: int
    exam_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Branch(BranchInDBBase):
    pass
