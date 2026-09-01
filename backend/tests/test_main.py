import pytest
from fastapi.testclient import TestClient
from app.config import settings

# Wait to import app until we have mocked/setup env if needed
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["app"] == settings.APP_NAME
    assert response.json()["status"] == "running"

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
