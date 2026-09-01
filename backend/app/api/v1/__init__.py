from fastapi import APIRouter
from app.api.v1.endpoints import auth, subjects, questions, practice, mock_tests

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
api_router.include_router(questions.router, prefix="/questions", tags=["Questions"])
api_router.include_router(practice.router, prefix="/practice", tags=["Practice"])
api_router.include_router(mock_tests.router, prefix="/mock-tests", tags=["Mock Tests"])
