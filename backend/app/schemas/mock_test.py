"""Mock Test-related Pydantic schemas"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum
from app.schemas.question import QuestionWithOptions, QuestionDetail


class MockTestType(str, Enum):
    FULL_SYLLABUS = "full_syllabus"
    SUBJECT_WISE = "subject_wise"
    TOPIC_WISE = "topic_wise"
    CUSTOM = "custom"


class MockTestResponse(BaseModel):
    """Basic mock test response"""
    id: int
    name: str
    description: Optional[str] = None
    test_type: MockTestType
    duration_minutes: int
    total_marks: int

    class Config:
        from_attributes = True


class MockTestQuestionInfo(BaseModel):
    """Question info in mock test (with order)"""
    question_order: int
    question: QuestionWithOptions


class MockTestDetail(BaseModel):
    """Mock test with all questions"""
    id: int
    name: str
    description: Optional[str] = None
    test_type: MockTestType
    duration_minutes: int
    total_marks: int
    questions: List[MockTestQuestionInfo] = []


class MockTestAttemptResponse(BaseModel):
    """Mock test attempt summary"""
    id: int
    user_id: int
    mock_test_id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    total_time_seconds: Optional[int] = None
    score: int
    total_questions: int
    correct_answers: int
    incorrect_answers: int
    unattempted: int

    class Config:
        from_attributes = True


class MockTestResult(BaseModel):
    """Detailed mock test result"""
    attempt_id: int
    mock_test_id: int
    mock_test_name: str
    score: int
    total_marks: int
    total_questions: int
    correct_answers: int
    incorrect_answers: int
    unattempted: int
    accuracy: float  # Percentage
    total_time_seconds: Optional[int] = None
    questions: List[QuestionDetail] = []  # Questions with correct answers for review
