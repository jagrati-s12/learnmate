from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: int = 0

class SubjectCreate(SubjectBase):
    branch_id: int

class SubjectUpdate(SubjectBase):
    name: Optional[str] = None
    branch_id: Optional[int] = None

class SubjectInDBBase(SubjectBase):
    id: int
    branch_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SubjectResponse(SubjectInDBBase):
    pass

class TopicSimple(BaseModel):
    id: int
    chapter_id: int
    name: str
    description: Optional[str] = None
    display_order: int
    question_count: int = 0

    class Config:
        from_attributes = True

class ChapterWithTopics(BaseModel):
    id: int
    subject_id: int
    name: str
    description: Optional[str] = None
    display_order: int
    topics: List[TopicSimple] = []

    class Config:
        from_attributes = True

class SubjectWithTopics(BaseModel):
    """Subject with its chapters and topics"""
    id: int
    branch_id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: int
    chapters: List[ChapterWithTopics] = []

    class Config:
        from_attributes = True
