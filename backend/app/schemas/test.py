from datetime import datetime

from pydantic import BaseModel

from app.schemas.question import QuestionPublicResponse


class TestBase(BaseModel):
    title: str
    subject_id: int
    duration_minutes: int = 30
    total_marks: int = 0


class TestCreate(TestBase):
    pass


class TestResponse(TestBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class TestDetailResponse(TestResponse):
    """Test details with questions (answers hidden)."""
    questions: list[QuestionPublicResponse] = []


class TestSubmitRequest(BaseModel):
    """Answers submitted by the user: mapping of question_id -> selected_option."""
    answers: dict[str, str]  # {"1": "a", "2": "c", ...}
