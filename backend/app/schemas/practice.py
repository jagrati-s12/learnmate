from datetime import datetime

from pydantic import BaseModel


class PracticeSubmitRequest(BaseModel):
    question_id: int
    selected_option: str  # 'a', 'b', 'c', 'd'


class PracticeAttemptResponse(BaseModel):
    id: int
    user_id: int
    question_id: int
    selected_option: str
    is_correct: bool
    attempted_at: datetime

    model_config = {"from_attributes": True}


class PracticeResultResponse(BaseModel):
    """Returned immediately after submitting a practice answer."""
    is_correct: bool
    correct_option: str
    explanation: str | None = None
    attempt: PracticeAttemptResponse
