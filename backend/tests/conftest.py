import pytest
from httpx import AsyncClient, ASGITransport
import asyncio
from main import app
from app.database import get_db, Base, engine, SessionLocal
from app.auth import create_access_token
from app.models.user import User

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
def db_engine():
    Base.metadata.create_all(bind=engine)
    yield engine

@pytest.fixture
def db(db_engine):
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

@pytest.fixture
def override_get_db(db):
    def _override():
        yield db
    app.dependency_overrides[get_db] = _override
    yield
    app.dependency_overrides.pop(get_db, None)

import pytest_asyncio

@pytest_asyncio.fixture
async def async_client(override_get_db):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

@pytest.fixture
def student_user(db):
    user = db.query(User).filter(User.email == "student_practice@test.com").first()
    if not user:
        user = User(
            email="student_practice@test.com",
            full_name="Student Test",
            hashed_password="fake",
            is_active=True,
            is_admin=False
        )
        db.add(user)
        db.commit()
    return user

@pytest.fixture
def student_token_headers(student_user):
    access_token = create_access_token(subject=student_user.email)
    return {"Authorization": f"Bearer {access_token}"}
