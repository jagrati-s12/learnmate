import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
from app.database import Base
from app.models import Topic, Subject, Branch, Exam, Question, QuestionOption, QuestionAttempt, Chapter

@pytest.fixture
def test_topic(db):
    exam = db.query(Exam).filter_by(name="Test Exam Practice").first()
    if not exam:
        exam = Exam(name="Test Exam Practice", display_order=1)
        db.add(exam)
        db.commit()

    branch = db.query(Branch).filter_by(name="Test Branch Practice").first()
    if not branch:
        branch = Branch(exam_id=exam.id, name="Test Branch Practice", display_order=1)
        db.add(branch)
        db.commit()

    subject = db.query(Subject).filter_by(name="Test Subject Practice", branch_id=branch.id).first()
    if not subject:
        subject = Subject(branch_id=branch.id, name="Test Subject Practice", display_order=1)
        db.add(subject)
        db.commit()

    chapter = db.query(Chapter).filter_by(name="Test Chapter Practice", subject_id=subject.id).first()
    if not chapter:
        chapter = Chapter(subject_id=subject.id, name="Test Chapter Practice", display_order=1)
        db.add(chapter)
        db.commit()

    topic = db.query(Topic).filter_by(name="Test Topic Practice", chapter_id=chapter.id).first()
    if not topic:
        topic = Topic(chapter_id=chapter.id, name="Test Topic Practice", display_order=1)
        db.add(topic)
        db.commit()
    return topic

import uuid

@pytest.fixture
def test_questions(db, test_topic):
    questions = []
    run_id = str(uuid.uuid4())[:8]

    # Add 12 questions
    for i in range(12):
        q = Question(
            topic_id=test_topic.id,
            question_text=f"Test Question {i+1} {run_id}",
            explanation=f"Explanation {i+1}",
            difficulty="medium",
            marks=1
        )
        db.add(q)
        db.flush()

        # Add options A, B, C, D
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
    return questions


def test_start_practice_session_normal(student_token_headers: dict, test_topic, test_questions):
    response = client.post(
        f"/api/v1/practice/start?topic_id={test_topic.id}&num_questions=10",
        headers=student_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["topic_id"] == test_topic.id
    assert data["total_questions"] == 10
    assert len(data["questions"]) == 10


@pytest.fixture
def empty_topic(db):
    exam = db.query(Exam).filter_by(name="Empty Test Exam").first()
    if not exam:
        exam = Exam(name="Empty Test Exam", display_order=2)
        db.add(exam)
        db.commit()

    branch = db.query(Branch).filter_by(name="Empty Test Branch").first()
    if not branch:
        branch = Branch(exam_id=exam.id, name="Empty Test Branch", display_order=2)
        db.add(branch)
        db.commit()

    subject = db.query(Subject).filter_by(name="Empty Test Subject", branch_id=branch.id).first()
    if not subject:
        subject = Subject(branch_id=branch.id, name="Empty Test Subject", display_order=2)
        db.add(subject)
        db.commit()

    chapter = db.query(Chapter).filter_by(name="Empty Test Chapter", subject_id=subject.id).first()
    if not chapter:
        chapter = Chapter(subject_id=subject.id, name="Empty Test Chapter", display_order=2)
        db.add(chapter)
        db.commit()

    topic = db.query(Topic).filter_by(name="Empty Test Topic", chapter_id=chapter.id).first()
    if not topic:
        topic = Topic(chapter_id=chapter.id, name="Empty Test Topic", display_order=2)
        db.add(topic)
        db.commit()
    return topic

def test_start_practice_session_no_questions(student_token_headers: dict, empty_topic):
    # This topic has no questions
    response = client.post(
        f"/api/v1/practice/start?topic_id={empty_topic.id}&num_questions=10",
        headers=student_token_headers
    )
    assert response.status_code == 404
    assert "No questions found" in response.json()["detail"]


def test_start_practice_session_invalid_topic(student_token_headers: dict):
    response = client.post(
        f"/api/v1/practice/start?topic_id=999&num_questions=10",
        headers=student_token_headers
    )
    assert response.status_code == 404
    assert "Topic not found" in response.json()["detail"]


def test_start_practice_unauthorized(test_topic):
    response = client.post(
        f"/api/v1/practice/start?topic_id={test_topic.id}&num_questions=10"
    )
    assert response.status_code == 401


def test_submit_answer_correct(student_token_headers: dict, test_questions, db):
    q = test_questions[0]
    payload = {
        "question_id": q.id,
        "selected_option": "A",
        "time_taken_seconds": 12
    }
    response = client.post(
        "/api/v1/practice/submit-answer",
        json=payload,
        headers=student_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_correct"] is True
    assert data["correct_option"] == "A"

    # Check if attempt is recorded
    attempts = db.query(QuestionAttempt).filter(QuestionAttempt.question_id == q.id).all()
    assert len(attempts) == 1
    assert attempts[0].is_correct is True


def test_submit_answer_wrong(student_token_headers: dict, test_questions, db):
    q = test_questions[1]
    payload = {
        "question_id": q.id,
        "selected_option": "D",
        "time_taken_seconds": 15
    }
    response = client.post(
        "/api/v1/practice/submit-answer",
        json=payload,
        headers=student_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_correct"] is False
    assert data["correct_option"] == "A"

    attempts = db.query(QuestionAttempt).filter(QuestionAttempt.question_id == q.id).all()
    assert len(attempts) == 1
    assert attempts[0].is_correct is False


def test_submit_answer_invalid_question(student_token_headers: dict):
    payload = {
        "question_id": 9999,
        "selected_option": "A",
        "time_taken_seconds": 15
    }
    response = client.post(
        "/api/v1/practice/submit-answer",
        json=payload,
        headers=student_token_headers
    )
    assert response.status_code == 404
    assert "Question not found" in response.json()["detail"]
