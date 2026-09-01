"""Topic-related Pydantic schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TopicResponse(BaseModel):
    """Basic topic response"""
    id: int
    subject_id: int
    name: str
    description: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True


class TopicWithQuestionCount(BaseModel):
    """Topic with question statistics"""
    id: int
    subject_id: int
    name: str
    description: Optional[str] = None
    display_order: int
    question_count: int = 0

    class Config:
        from_attributes = True
