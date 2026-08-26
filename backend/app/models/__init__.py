# Import all models so Alembic and Base.metadata.create_all() can discover them.
from app.models.user import User  # noqa: F401
from app.models.subject import Subject  # noqa: F401
from app.models.chapter import Chapter  # noqa: F401
from app.models.topic import Topic  # noqa: F401
from app.models.question import Question  # noqa: F401
from app.models.practice import PracticeAttempt  # noqa: F401
from app.models.test import Test, TestQuestion  # noqa: F401
from app.models.result import TestResult, ProgressSnapshot  # noqa: F401
