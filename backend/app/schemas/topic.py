from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TopicBase(BaseModel):
    name: str
    description: Optional[str] = None
    display_order: int = 0

class TopicCreate(TopicBase):
    chapter_id: int

class TopicUpdate(TopicBase):
    name: Optional[str] = None
    chapter_id: Optional[int] = None

class TopicInDBBase(TopicBase):
    id: int
    chapter_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TopicResponse(TopicInDBBase):
    pass

class TopicWithQuestionCount(TopicResponse):
    question_count: int = 0
