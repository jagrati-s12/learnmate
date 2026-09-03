import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_questions():
    res = client.get("/api/v1/questions/")
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0
    # ensure it has pyq properties
    q = data[0]
    assert "is_pyq" in q
    assert "year" in q

def test_get_questions_filter_is_pyq():
    res = client.get("/api/v1/questions/?is_pyq=true")
    assert res.status_code == 200
    for q in res.json():
        assert q["is_pyq"] is True

def test_get_question_detail():
    res = client.get("/api/v1/questions/")
    assert len(res.json()) > 0
    q_id = res.json()[0]["id"]

    res_detail = client.get(f"/api/v1/questions/{q_id}")
    assert res_detail.status_code == 200
    data = res_detail.json()
    assert "explanation" in data
    assert "correct_option" in data

def test_submit_answer():
    res = client.get("/api/v1/questions/")
    assert len(res.json()) > 0
    q = res.json()[0]
    q_id = q["id"]

    # just get correct option directly to test submit valid
    res_detail = client.get(f"/api/v1/questions/{q_id}")
    correct = res_detail.json()["correct_option"]

    submit_res = client.post("/api/v1/questions/submit", json={
        "question_id": q_id,
        "selected_option": correct,
        "time_taken_seconds": 15
    })

    assert submit_res.status_code == 200
    assert submit_res.json()["is_correct"] is True
    assert submit_res.json()["correct_option"] == correct
