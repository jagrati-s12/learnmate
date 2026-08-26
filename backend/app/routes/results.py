from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.result import TestResult, ProgressSnapshot
from app.models.practice import PracticeAttempt
from app.models.question import Question
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.chapter import Chapter
from app.schemas.result import TestResultResponse, ProgressSnapshotResponse, SubjectProgressResponse

router = APIRouter(prefix="/api", tags=["Results & Progress"])


# ---------------------------------------------------------------------------
# GET /api/results — list user's test results
# ---------------------------------------------------------------------------
@router.get("/results", response_model=list[TestResultResponse])
def list_results(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List the authenticated user's test results."""
    return (
        db.query(TestResult)
        .filter(TestResult.user_id == current_user.id)
        .order_by(TestResult.submitted_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# ---------------------------------------------------------------------------
# GET /api/results/{result_id} — get a single test result
# ---------------------------------------------------------------------------
@router.get("/results/{result_id}", response_model=TestResultResponse)
def get_result(
    result_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get detailed result for a specific test attempt."""
    result = (
        db.query(TestResult)
        .filter(TestResult.id == result_id, TestResult.user_id == current_user.id)
        .first()
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found.")
    return result


# ---------------------------------------------------------------------------
# GET /api/progress — aggregated progress across subjects
# ---------------------------------------------------------------------------
@router.get("/progress", response_model=list[SubjectProgressResponse])
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get the authenticated user's aggregated progress per subject.
    Computes stats from practice attempts and test results on the fly.
    """
    subjects = db.query(Subject).all()
    progress: list[SubjectProgressResponse] = []

    for subject in subjects:
        # Get all topic IDs under this subject
        chapter_ids = [c.id for c in db.query(Chapter).filter(Chapter.subject_id == subject.id).all()]
        topic_ids = (
            [t.id for t in db.query(Topic).filter(Topic.chapter_id.in_(chapter_ids)).all()]
            if chapter_ids
            else []
        )

        # Total questions in this subject
        total_questions = (
            db.query(sql_func.count(Question.id))
            .filter(Question.topic_id.in_(topic_ids))
            .scalar()
            if topic_ids
            else 0
        )

        # User's practice attempts on this subject's questions
        if topic_ids:
            question_ids_in_subject = [
                q.id for q in db.query(Question.id).filter(Question.topic_id.in_(topic_ids)).all()
            ]
        else:
            question_ids_in_subject = []

        if question_ids_in_subject:
            attempts = (
                db.query(PracticeAttempt)
                .filter(
                    PracticeAttempt.user_id == current_user.id,
                    PracticeAttempt.question_id.in_(question_ids_in_subject),
                )
                .all()
            )
            questions_attempted = len(set(a.question_id for a in attempts))
            correct_answers = sum(1 for a in attempts if a.is_correct)
            accuracy = (correct_answers / len(attempts) * 100) if attempts else 0.0
        else:
            questions_attempted = 0
            correct_answers = 0
            accuracy = 0.0

        # Test results for this subject
        test_results = (
            db.query(TestResult)
            .join(TestResult.test)
            .filter(TestResult.user_id == current_user.id)
            .all()
        )
        subject_test_results = [r for r in test_results if r.test.subject_id == subject.id]
        tests_taken = len(subject_test_results)
        avg_score = (
            sum(r.score / r.total * 100 for r in subject_test_results if r.total > 0) / tests_taken
            if tests_taken
            else 0.0
        )

        progress.append(
            SubjectProgressResponse(
                subject_id=subject.id,
                subject_name=subject.name,
                total_questions=total_questions,
                questions_attempted=questions_attempted,
                correct_answers=correct_answers,
                accuracy_pct=round(accuracy, 1),
                tests_taken=tests_taken,
                average_score_pct=round(avg_score, 1),
            )
        )

    return progress
