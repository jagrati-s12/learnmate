import pytest
from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)
from app.models import (
    MockTest, MockTestQuestion, MockTestAttempt, QuestionAttempt,
    Topic, Chapter, Subject, Branch, Exam, Question, QuestionOption
)


@pytest.fixture
def setup_advanced_test(db, mock_test_hierarchy, student_token_headers):
    """Setup for advanced mock test features"""
    mock_test = MockTest(
        name="Advanced Features Test",
        description="Test palette, marking, analytics",
        test_type="full_syllabus",
        duration_minutes=30,
        total_marks=10,
        negative_marking=0.25
    )
    db.add(mock_test)
    db.commit()
    db.refresh(mock_test)

    # Add 10 questions
    for order, q in enumerate(mock_test_hierarchy["questions"][:10], start=1):
        mtq = MockTestQuestion(
            mock_test_id=mock_test.id,
            question_id=q.id,
            question_order=order
        )
        db.add(mtq)
    db.commit()

    # Start the test
    start_response = client.get(
        f"/api/v1/mock-tests/{mock_test.id}/start",
        headers=student_token_headers
    )
    assert start_response.status_code == 200

    return {
        "mock_test": mock_test,
        "attempt_id": start_response.json()["attempt_id"],
        "questions": start_response.json()["questions"]
    }


def test_question_palette_initial_state(setup_advanced_test, student_token_headers, db):
    """Test question palette shows all unanswered initially"""
    test_data = setup_advanced_test

    response = client.get(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/palette",
        params={"attempt_id": test_data["attempt_id"]},
        headers=student_token_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["summary"]["total"] == 10
    assert data["summary"]["unanswered"] == 10
    assert data["summary"]["answered"] == 0
    assert data["summary"]["marked"] == 0


def test_mark_question_for_review(setup_advanced_test, student_token_headers, db):
    """Test marking a question for review"""
    test_data = setup_advanced_test
    question_id = test_data["questions"][0]["id"]

    response = client.post(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/mark-for-review",
        params={
            "attempt_id": test_data["attempt_id"],
            "question_id": question_id
        },
        headers=student_token_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["marked_for_review"] is True

    # Verify palette reflects the change
    palette_response = client.get(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/palette",
        params={"attempt_id": test_data["attempt_id"]},
        headers=student_token_headers
    )
    palette_data = palette_response.json()
    assert palette_data["summary"]["marked"] == 1


def test_toggle_mark_for_review(setup_advanced_test, student_token_headers, db):
    """Test toggling mark for review on/off"""
    test_data = setup_advanced_test
    question_id = test_data["questions"][0]["id"]

    # Mark
    client.post(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/mark-for-review",
        params={
            "attempt_id": test_data["attempt_id"],
            "question_id": question_id
        },
        headers=student_token_headers
    )

    # Unmark
    response = client.post(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/mark-for-review",
        params={
            "attempt_id": test_data["attempt_id"],
            "question_id": question_id
        },
        headers=student_token_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["marked_for_review"] is False


def test_auto_submit_on_expiry(setup_advanced_test, student_token_headers, db):
    """Test auto-submission when timer expires"""
    test_data = setup_advanced_test

    response = client.post(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/auto-submit",
        params={"attempt_id": test_data["attempt_id"]},
        headers=student_token_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["auto_submitted"] is True
    assert "timer expiry" in data["message"]

    # Verify attempt is completed
    attempt = db.query(MockTestAttempt).filter(
        MockTestAttempt.id == test_data["attempt_id"]
    ).first()
    assert attempt.completed_at is not None


def test_auto_submit_already_completed(setup_advanced_test, student_token_headers, db):
    """Test auto-submit rejects if already completed"""
    test_data = setup_advanced_test

    # Submit first
    client.post(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/auto-submit",
        params={"attempt_id": test_data["attempt_id"]},
        headers=student_token_headers
    )

    # Try again
    response = client.post(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/auto-submit",
        params={"attempt_id": test_data["attempt_id"]},
        headers=student_token_headers
    )

    assert response.status_code == 400
    assert "already completed" in response.json()["detail"]


def test_analytics_subject_performance(sample_mock_test, student_token_headers, db):
    """Test analytics endpoint for subject-wise performance"""
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
        "time_taken_seconds": 25 + i
    } for i, q in enumerate(questions[:7])]

    client.post(
        f"/api/v1/mock-tests/attempt/{attempt_id}/submit",
        json=answers,
        headers=student_token_headers
    )

    # Get analytics
    response = client.get(
        f"/api/v1/mock-tests/{sample_mock_test.id}/analytics/{attempt_id}",
        headers=student_token_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert "subject_performance" in data
    assert "difficulty_performance" in data
    assert "time_analysis" in data
    assert data["time_analysis"]["average_time_per_question"] > 0


def test_analytics_not_completed(setup_advanced_test, student_token_headers):
    """Test analytics not available before completion"""
    test_data = setup_advanced_test

    response = client.get(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/analytics/{test_data['attempt_id']}",
        headers=student_token_headers
    )

    assert response.status_code == 400
    assert "not yet completed" in response.json()["detail"]


def test_palette_after_answers(setup_advanced_test, student_token_headers, db):
    """Test palette updates correctly after answering questions"""
    test_data = setup_advanced_test

    # Answer 3 questions
    for i in range(3):
        qa = QuestionAttempt(
            user_id=1,  # Assuming student user id is 1
            question_id=test_data["questions"][i]["id"],
            mock_test_attempt_id=test_data["attempt_id"],
            selected_option="A",
            is_correct=True,
            time_taken_seconds=20
        )
        db.add(qa)
    db.commit()

    # Check palette
    response = client.get(
        f"/api/v1/mock-tests/{test_data['mock_test'].id}/palette",
        params={"attempt_id": test_data["attempt_id"]},
        headers=student_token_headers
    )

    data = response.json()
    assert data["summary"]["answered"] == 3
    assert data["summary"]["unanswered"] == 7


def test_negative_marking_calculation(sample_mock_test, student_token_headers, db):
    """Test that negative marking is correctly applied"""
    start_response = client.get(
        f"/api/v1/mock-tests/{sample_mock_test.id}/start",
        headers=student_token_headers
    )
    attempt_id = start_response.json()["attempt_id"]
    questions = start_response.json()["questions"]

    # Answer: 6 correct, 4 wrong (should be 6 - 4*0.25 = 5.0)
    answers = []
    for i, q in enumerate(questions):
        answers.append({
            "question_id": q["id"],
            "selected_option": "A" if i < 6 else "B",
            "time_taken_seconds": 30
        })

    response = client.post(
        f"/api/v1/mock-tests/attempt/{attempt_id}/submit",
        json=answers,
        headers=student_token_headers
    )

    data = response.json()
    assert data["correct_answers"] == 6
    assert data["incorrect_answers"] == 4
    assert data["score"] == 5.0  # 6 - (4 * 0.25)
