from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChapterBase(BaseModel):
    name: str
    description: Optional[str] = None
    display_order: int = 0

class ChapterCreate(ChapterBase):
    subject_id: int

class ChapterUpdate(ChapterBase):
    name: Optional[str] = None
    subject_id: Optional[int] = None

class ChapterInDBBase(ChapterBase):
    id: int
    subject_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Chapter(ChapterInDBBase):
    pass
