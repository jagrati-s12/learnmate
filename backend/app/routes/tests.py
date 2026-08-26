from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.test import Test, TestQuestion
from app.models.question import Question
from app.models.result import TestResult
from app.schemas.test import TestResponse, TestDetailResponse, TestSubmitRequest
from app.schemas.question import QuestionPublicResponse
from app.schemas.result import TestResultResponse

router = APIRouter(prefix="/api", tags=["Tests"])


# ---------------------------------------------------------------------------
# GET /api/tests — list available tests
# ---------------------------------------------------------------------------
@router.get("/tests", response_model=list[TestResponse])
def list_tests(
    subject_id: int | None = Query(None, description="Filter by subject"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List all available tests."""
    query = db.query(Test)
    if subject_id is not None:
        query = query.filter(Test.subject_id == subject_id)
    return query.offset(skip).limit(limit).all()


# ---------------------------------------------------------------------------
# GET /api/tests/{test_id} — get test details + questions (answers hidden)
# ---------------------------------------------------------------------------
@router.get("/tests/{test_id}", response_model=TestDetailResponse)
def get_test(test_id: int, db: Session = Depends(get_db)):
    """Get test details including questions (without answers)."""
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test not found.")

    # Gather questions linked to this test via TestQuestion junction
    test_questions = db.query(TestQuestion).filter(TestQuestion.test_id == test_id).all()
    question_ids = [tq.question_id for tq in test_questions]
    questions = db.query(Question).filter(Question.id.in_(question_ids)).all() if question_ids else []

    return TestDetailResponse(
        id=test.id,
        title=test.title,
        subject_id=test.subject_id,
        duration_minutes=test.duration_minutes,
        total_marks=test.total_marks,
        created_at=test.created_at,
        questions=[QuestionPublicResponse.model_validate(q) for q in questions],
    )


# ---------------------------------------------------------------------------
# POST /api/tests/{test_id}/submit — submit answers and auto-score
# ---------------------------------------------------------------------------
@router.post("/tests/{test_id}/submit", response_model=TestResultResponse, status_code=status.HTTP_201_CREATED)
def submit_test(
    test_id: int,
    body: TestSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit test answers. The server auto-scores and stores the result."""
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test not found.")

    # Load test questions with their marks
    test_questions = db.query(TestQuestion).filter(TestQuestion.test_id == test_id).all()
    tq_map = {tq.question_id: tq.marks for tq in test_questions}

    # Load actual questions for answer checking
    question_ids = list(tq_map.keys())
    questions = db.query(Question).filter(Question.id.in_(question_ids)).all() if question_ids else []
    q_correct = {q.id: q.correct_option.lower() for q in questions}

    # Score
    score = 0
    total = sum(tq_map.values())
    for qid_str, selected in body.answers.items():
        qid = int(qid_str)
        if qid in q_correct and selected.lower() == q_correct[qid]:
            score += tq_map.get(qid, 1)

    result = TestResult(
        user_id=current_user.id,
        test_id=test_id,
        score=score,
        total=total,
        answers=body.answers,
    )
    db.add(result)
    db.commit()
    db.refresh(result)

    return result
