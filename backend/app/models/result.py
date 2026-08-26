from datetime import datetime, date

from sqlalchemy import Integer, Float, ForeignKey, DateTime, Date, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TestResult(Base):
    __tablename__ = "test_results"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"), nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    total: Mapped[int] = mapped_column(Integer, nullable=False)
    answers: Mapped[dict | None] = mapped_column(JSON)  # {"question_id": "selected_option", ...}
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="test_results")
    test = relationship("Test", back_populates="results")

    def __repr__(self) -> str:
        return f"<TestResult user={self.user_id} test={self.test_id} score={self.score}/{self.total}>"


class ProgressSnapshot(Base):
    """Periodic snapshot of a user's progress in a subject."""
    __tablename__ = "progress_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    mastery_pct: Mapped[float] = mapped_column(Float, default=0.0)
    questions_solved: Mapped[int] = mapped_column(Integer, default=0)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    snapshot_date: Mapped[date] = mapped_column(Date, server_default=func.current_date())

    # Relationships
    user = relationship("User", back_populates="progress_snapshots")
    subject = relationship("Subject", back_populates="progress_snapshots")

    def __repr__(self) -> str:
        return f"<Progress user={self.user_id} subject={self.subject_id} mastery={self.mastery_pct}%>"
