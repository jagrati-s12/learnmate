import pytest
from fastapi.testclient import TestClient
from main import app
from datetime import datetime
import uuid

client = TestClient(app)
from app.database import Base
from app.models import (
    Topic, Subject, Branch, Exam, Question, QuestionOption,
    MockTest, MockTestQuestion, MockTestAttempt, QuestionAttempt, Chapter, User
)


@pytest.fixture
def admin_user(db):
    user = db.query(User).filter(User.email == "admin_mock@test.com").first()
    if not user:
        user = User(
            email="admin_mock@test.com",
            full_name="Admin Mock",
            hashed_password="fake",
            is_active=True,
            is_admin=True
        )
        db.add(user)
        db.commit()
    return user


@pytest.fixture
def admin_token_headers(admin_user):
    from app.auth import create_access_token
    access_token = create_access_token(subject=admin_user.email)
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def mock_test_hierarchy(db):
    """Create complete hierarchy with questions for mock test generation"""
    exam = db.query(Exam).filter_by(name="Mock Test Exam").first()
    if not exam:
        exam = Exam(name="Mock Test Exam", display_order=1)
        db.add(exam)
        db.commit()

    branch = db.query(Branch).filter_by(name="Mock Test Branch").first()
    if not branch:
        branch = Branch(exam_id=exam.id, name="Mock Test Branch", display_order=1)
        db.add(branch)
        db.commit()

    subject = db.query(Subject).filter_by(name="Mock Test Subject", branch_id=branch.id).first()
    if not subject:
        subject = Subject(branch_id=branch.id, name="Mock Test Subject", display_order=1)
        db.add(subject)
        db.commit()

    chapter = db.query(Chapter).filter_by(name="Mock Test Chapter", subject_id=subject.id).first()
    if not chapter:
        chapter = Chapter(subject_id=subject.id, name="Mock Test Chapter", display_order=1)
        db.add(chapter)
        db.commit()

    topic = db.query(Topic).filter_by(name="Mock Test Topic", chapter_id=chapter.id).first()
    if not topic:
        topic = Topic(chapter_id=chapter.id, name="Mock Test Topic", display_order=1)
        db.add(topic)
        db.commit()

    # Create 15 questions for testing
    questions = []
    run_id = str(uuid.uuid4())[:8]
    for i in range(15):
        q = Question(
            topic_id=topic.id,
            question_text=f"Mock Test Question {i+1} {run_id}",
            explanation=f"Explanation {i+1}",
            difficulty="medium",
            marks=1
        )
        db.add(q)
        db.flush()

        for label in ["A", "B", "C", "D"]:
            opt = QuestionOption(
                question_id=q.id,
                option_text=f"Option {label} for Q{i+1}",
                option_label=label,
                is_correct=1 if label == "A" else 0
            )
            db.add(opt)
        questions.append(q)

    db.commit()
    return {"exam": exam, "branch": branch, "subject": subject, "chapter": chapter, "topic": topic, "questions": questions}


@pytest.fixture
def sample_mock_test(db, mock_test_hierarchy):
    """Create a sample mock test with questions"""
    mock_test = MockTest(
        name="Sample Mock Test",
        description="Test for mock test endpoints",
        test_type="full_syllabus",
        duration_minutes=60,
        total_marks=10,
        negative_marking=0.25
    )
    db.add(mock_test)
    db.commit()
    db.refresh(mock_test)

    # Add 10 questions to the mock test
    for order, q in enumerate(mock_test_hierarchy["questions"][:10], start=1):
        mtq = MockTestQuestion(
            mock_test_id=mock_test.id,
            question_id=q.id,
            question_order=order
        )
        db.add(mtq)
    db.commit()
    return mock_test


def test_generate_mock_test_admin(admin_token_headers, mock_test_hierarchy, db):
    """Test mock test generation by admin"""
    payload = {
        "name": "Generated Mock Test",
        "description": "Auto-generated test",
        "test_type": "subject_wise",
        "duration_minutes": 90,
        "total_questions": 10,
        "total_marks": 10,
        "negative_marking": 0.25,
        "subject_id": mock_test_hierarchy["subject"].id
    }
    response = client.post(
        "/api/v1/mock-tests/generate",
        json=payload,
        headers=admin_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Generated Mock Test"
    assert data["total_marks"] == 10
    assert data["negative_marking"] == 0.25


def test_generate_mock_test_unauthorized(student_token_headers, mock_test_hierarchy):
    """Test that non-admin cannot generate mock tests"""
    payload = {
        "name": "Unauthorized Test",
        "test_type": "full_syllabus",
        "duration_minutes": 60,
        "total_questions": 10,
        "total_marks": 10
    }
    response = client.post(
        "/api/v1/mock-tests/generate",
        json=payload,
        headers=student_token_headers
    )
    assert response.status_code == 403


def test_get_available_mock_tests(sample_mock_test):
    """Test retrieving list of mock tests"""
    response = client.get("/api/v1/mock-tests/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_start_mock_test(sample_mock_test, student_token_headers):
    """Test starting a mock test"""
    response = client.get(
        f"/api/v1/mock-tests/{sample_mock_test.id}/start",
        headers=student_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "attempt_id" in data
    assert data["mock_test"]["id"] == sample_mock_test.id
    assert data["total_questions"] == 10
    assert len(data["questions"]) == 10


def test_start_mock_test_unauthorized(sample_mock_test):
    """Test starting mock test without authentication"""
    response = client.get(f"/api/v1/mock-tests/{sample_mock_test.id}/start")
    assert response.status_code == 401


def test_submit_mock_test(sample_mock_test, student_token_headers, db):
    """Test submitting a complete mock test"""
    # Start test first
    start_response = client.get(
        f"/api/v1/mock-tests/{sample_mock_test.id}/start",
        headers=student_token_headers
    )
    assert start_response.status_code == 200
    attempt_id = start_response.json()["attempt_id"]
    questions = start_response.json()["questions"]

    # Submit answers (5 correct, 3 incorrect, 2 unanswered)
    answers = []
    for i, q in enumerate(questions[:8]):
        answers.append({
            "question_id": q["id"],
            "selected_option": "A" if i < 5 else "B",  # First 5 correct, next 3 wrong
            "time_taken_seconds": 30 + i
        })

    response = client.post(
        f"/api/v1/mock-tests/attempt/{attempt_id}/submit",
        json=answers,
        headers=student_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["correct_answers"] == 5
    assert data["incorrect_answers"] == 3
    assert data["unattempted"] == 2
    # Score: 5 correct (5 marks) - 3 incorrect (3 * 0.25 = 0.75 negative) = 4.25
    assert data["score"] == 4.25


def test_submit_mock_test_already_submitted(sample_mock_test, student_token_headers, db):
    """Test that a test cannot be submitted twice"""
    # Start and submit test
    start_response = client.get(
        f"/api/v1/mock-tests/{sample_mock_test.id}/start",
        headers=student_token_headers
    )
    attempt_id = start_response.json()["attempt_id"]

    answers = [{
        "question_id": start_response.json()["questions"][0]["id"],
        "selected_option": "A",
        "time_taken_seconds": 20
    }]

    client.post(
        f"/api/v1/mock-tests/attempt/{attempt_id}/submit",
        json=answers,
        headers=student_token_headers
    )

    # Try to submit again
    response = client.post(
        f"/api/v1/mock-tests/attempt/{attempt_id}/submit",
        json=answers,
        headers=student_token_headers
    )
    assert response.status_code == 400
    assert "already submitted" in response.json()["detail"]


def test_get_user_attempts(sample_mock_test, student_token_headers, db):
    """Test retrieving user's mock test attempts"""
    # Start a test
    client.get(
        f"/api/v1/mock-tests/{sample_mock_test.id}/start",
        headers=student_token_headers
    )

    response = client.get(
        "/api/v1/mock-tests/attempts",
        headers=student_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_mock_test_result(sample_mock_test, student_token_headers, db):
    """Test retrieving detailed result for a completed test"""
    # Start and submit test
    start_response = client.get(
        f"/api/v1/mock-tests/{sample_mock_test.id}/start",
        headers=student_token_headers
    )
    attempt_id = start_response.json()["attempt_id"]
    questions = start_response.json()["questions"]

    answers = [{
        "question_id": q["id"],
        "selected_option": "A",
        "time_taken_seconds": 25
    } for q in questions[:5]]

    client.post(
        f"/api/v1/mock-tests/attempt/{attempt_id}/submit",
        json=answers,
        headers=student_token_headers
    )

    # Get result
    response = client.get(
        f"/api/v1/mock-tests/result/{attempt_id}",
        headers=student_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["attempt_id"] == attempt_id
    assert "questions" in data
    assert len(data["questions"]) == 10


def test_get_result_not_submitted(sample_mock_test, student_token_headers):
    """Test that result is not available before submission"""
    start_response = client.get(
        f"/api/v1/mock-tests/{sample_mock_test.id}/start",
        headers=student_token_headers
    )
    attempt_id = start_response.json()["attempt_id"]

    response = client.get(
        f"/api/v1/mock-tests/result/{attempt_id}",
        headers=student_token_headers
    )
    assert response.status_code == 400
    assert "not yet submitted" in response.json()["detail"]
