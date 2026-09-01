"""Subject-related Pydantic schemas"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SubjectResponse(BaseModel):
    """Basic subject response"""
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True


class TopicSimple(BaseModel):
    """Simple topic schema for nested responses"""
    id: int
    name: str
    description: Optional[str] = None
    display_order: int
    question_count: int = 0

    class Config:
        from_attributes = True


class SubjectWithTopics(BaseModel):
    """Subject with its topics"""
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: int
    topics: List[TopicSimple] = []

    class Config:
        from_attributes = True
