"""Pydantic schemas for request/response validation"""
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserUpdate, TokenResponse
from app.schemas.exam import ExamCreate, ExamUpdate, Exam
from app.schemas.branch import BranchCreate, BranchUpdate, Branch
from app.schemas.chapter import ChapterCreate, ChapterUpdate, Chapter
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse, SubjectWithTopics, ChapterWithTopics, TopicSimple
from app.schemas.topic import TopicCreate, TopicUpdate, TopicResponse, TopicWithQuestionCount
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
    MockTestResult,
    MockTestGenerateRequest
)

__all__ = [
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "UserUpdate",
    "TokenResponse",
    "ExamCreate",
    "ExamUpdate",
    "Exam",
    "BranchCreate",
    "BranchUpdate",
    "Branch",
    "ChapterCreate",
    "ChapterUpdate",
    "Chapter",
    "SubjectCreate",
    "SubjectUpdate",
    "SubjectResponse",
    "SubjectWithTopics",
    "ChapterWithTopics",
    "TopicSimple",
    "TopicCreate",
    "TopicUpdate",
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
    "MockTestGenerateRequest",
]
