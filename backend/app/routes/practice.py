from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.question import Question
from app.models.practice import PracticeAttempt
from app.schemas.practice import PracticeSubmitRequest, PracticeAttemptResponse, PracticeResultResponse
from app.schemas.question import QuestionPublicResponse

router = APIRouter(prefix="/api", tags=["Practice"])


# ---------------------------------------------------------------------------
# GET /api/practice — get practice questions for the user
# ---------------------------------------------------------------------------
@router.get("/practice", response_model=list[QuestionPublicResponse])
def get_practice_questions(
    topic_id: int | None = Query(None, description="Filter by topic"),
    difficulty: str | None = Query(None, description="Filter by difficulty"),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get practice questions for the authenticated user.
    Answers are hidden — only question text and options are returned.
    """
    query = db.query(Question)
    if topic_id is not None:
        query = query.filter(Question.topic_id == topic_id)
    if difficulty is not None:
        query = query.filter(Question.difficulty == difficulty.lower())
    return query.limit(limit).all()


# ---------------------------------------------------------------------------
# POST /api/practice — submit a practice answer
# ---------------------------------------------------------------------------
@router.post("/practice", response_model=PracticeResultResponse, status_code=status.HTTP_201_CREATED)
def submit_practice_answer(
    body: PracticeSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit an answer for a practice question and get immediate feedback."""
    question = db.query(Question).filter(Question.id == body.question_id).first()
    if not question:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Question not found.")

    is_correct = body.selected_option.lower() == question.correct_option.lower()

    attempt = PracticeAttempt(
        user_id=current_user.id,
        question_id=question.id,
        selected_option=body.selected_option.lower(),
        is_correct=is_correct,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return PracticeResultResponse(
        is_correct=is_correct,
        correct_option=question.correct_option,
        explanation=question.explanation,
        attempt=PracticeAttemptResponse.model_validate(attempt),
    )


# ---------------------------------------------------------------------------
# GET /api/attempts — list past practice attempts
# ---------------------------------------------------------------------------
@router.get("/attempts", response_model=list[PracticeAttemptResponse])
def list_attempts(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List the authenticated user's past practice attempts."""
    return (
        db.query(PracticeAttempt)
        .filter(PracticeAttempt.user_id == current_user.id)
        .order_by(PracticeAttempt.attempted_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
