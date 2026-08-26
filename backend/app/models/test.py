from datetime import datetime

from sqlalchemy import String, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Test(Base):
    __tablename__ = "tests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    total_marks: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    subject = relationship("Subject", back_populates="tests")
    test_questions = relationship("TestQuestion", back_populates="test", lazy="selectin", cascade="all, delete-orphan")
    results = relationship("TestResult", back_populates="test", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Test {self.title}>"


class TestQuestion(Base):
    """Junction table linking questions to a test with per-question marks."""
    __tablename__ = "test_questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    marks: Mapped[int] = mapped_column(Integer, default=1)

    # Relationships
    test = relationship("Test", back_populates="test_questions")
    question = relationship("Question", back_populates="test_questions")

    def __repr__(self) -> str:
        return f"<TestQuestion test={self.test_id} q={self.question_id}>"
