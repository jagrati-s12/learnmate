from datetime import datetime, date

from pydantic import BaseModel


class TestResultResponse(BaseModel):
    id: int
    user_id: int
    test_id: int
    score: int
    total: int
    answers: dict | None = None
    submitted_at: datetime

    model_config = {"from_attributes": True}


class ProgressSnapshotResponse(BaseModel):
    id: int
    user_id: int
    subject_id: int
    mastery_pct: float
    questions_solved: int
    streak_days: int
    snapshot_date: date

    model_config = {"from_attributes": True}


class SubjectProgressResponse(BaseModel):
    """Aggregated progress for a single subject."""
    subject_id: int
    subject_name: str
    total_questions: int
    questions_attempted: int
    correct_answers: int
    accuracy_pct: float
    tests_taken: int
    average_score_pct: float
