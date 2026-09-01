"""Question-related Pydantic schemas"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuestionOptionResponse(BaseModel):
    """Question option response (without exposing which is correct)"""
    id: int
    option_text: str
    option_label: str

    class Config:
        from_attributes = True


class QuestionOptionWithCorrect(QuestionOptionResponse):
    """Question option with correct answer (for review)"""
    is_correct: bool


class QuestionResponse(BaseModel):
    """Basic question response (without options)"""
    id: int
    topic_id: int
    question_text: str
    difficulty: DifficultyLevel
    marks: int

    class Config:
        from_attributes = True


class QuestionWithOptions(BaseModel):
    """Question with options (for practice mode - hides correct answer)"""
    id: int
    topic_id: int
    question_text: str
    difficulty: DifficultyLevel
    marks: int
    options: List[QuestionOptionResponse]


class QuestionDetail(QuestionWithOptions):
    """Question detail with explanation (for review after submission)"""
    explanation: Optional[str] = None
    correct_option: str  # The correct option label (A, B, C, D)


class AnswerSubmission(BaseModel):
    """User's answer submission"""
    question_id: int
    selected_option: Optional[str] = None  # NULL if not answered
    time_taken_seconds: Optional[int] = None


class AnswerResult(BaseModel):
    """Result of answer submission"""
    question_id: int
    is_correct: bool
    correct_option: str
    explanation: Optional[str] = None
    selected_option: Optional[str] = None
    time_taken_seconds: Optional[int] = None
