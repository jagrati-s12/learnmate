"""Pydantic schemas for request/response validation"""
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserUpdate, TokenResponse
from app.schemas.subject import SubjectResponse, SubjectWithTopics
from app.schemas.topic import TopicResponse, TopicWithQuestionCount
from app.schemas.question import (
    QuestionResponse,
    QuestionDetail,
    QuestionWithOptions,
    QuestionOptionResponse,
    QuestionOptionWithCorrect,
    AnswerSubmission,
    AnswerResult
)
from app.schemas.mock_test import (
    MockTestResponse,
    MockTestDetail,
    MockTestAttemptResponse,
    MockTestResult
)

__all__ = [
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "UserUpdate",
    "TokenResponse",
    "SubjectResponse",
    "SubjectWithTopics",
    "TopicResponse",
    "TopicWithQuestionCount",
    "QuestionResponse",
    "QuestionDetail",
    "QuestionWithOptions",
    "QuestionOptionResponse",
    "QuestionOptionWithCorrect",
    "AnswerSubmission",
    "AnswerResult",
    "MockTestResponse",
    "MockTestDetail",
    "MockTestAttemptResponse",
    "MockTestResult",
]
