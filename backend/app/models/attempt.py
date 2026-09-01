from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class QuestionAttempt(Base):
    __tablename__ = "question_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    mock_test_attempt_id = Column(Integer, ForeignKey("mock_test_attempts.id", ondelete="CASCADE"), nullable=True, index=True)
    selected_option = Column(String(1), nullable=True)  # A, B, C, D, or NULL if not answered
    is_correct = Column(Boolean, nullable=True)  # NULL if not answered
    time_taken_seconds = Column(Integer, nullable=True)  # Time taken in seconds
    is_marked_for_review = Column(Boolean, default=False)
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="question_attempts")
    question = relationship("Question", back_populates="attempts")
    mock_test_attempt = relationship("MockTestAttempt", back_populates="question_attempts")

    def __repr__(self):
        return f"<QuestionAttempt(id={self.id}, user_id={self.user_id}, question_id={self.question_id}, is_correct={self.is_correct})>"


class MockTestAttempt(Base):
    __tablename__ = "mock_test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    mock_test_id = Column(Integer, ForeignKey("mock_tests.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    total_time_seconds = Column(Integer, nullable=True)  # Actual time taken
    score = Column(Integer, default=0)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, default=0)
    incorrect_answers = Column(Integer, default=0)
    unattempted = Column(Integer, default=0)

    # Relationships
    user = relationship("User", back_populates="mock_test_attempts")
    mock_test = relationship("MockTest", back_populates="attempts")
    question_attempts = relationship("QuestionAttempt", back_populates="mock_test_attempt", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<MockTestAttempt(id={self.id}, user_id={self.user_id}, mock_test_id={self.mock_test_id}, score={self.score})>"
