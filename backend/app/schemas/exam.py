from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ExamBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True
    display_order: int = 0

class ExamCreate(ExamBase):
    pass

class ExamUpdate(ExamBase):
    name: Optional[str] = None

class ExamInDBBase(ExamBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Exam(ExamInDBBase):
    pass
