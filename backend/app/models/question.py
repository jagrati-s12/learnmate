from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    option_a: Mapped[str] = mapped_column(String(500), nullable=False)
    option_b: Mapped[str] = mapped_column(String(500), nullable=False)
    option_c: Mapped[str] = mapped_column(String(500), nullable=False)
    option_d: Mapped[str] = mapped_column(String(500), nullable=False)
    correct_option: Mapped[str] = mapped_column(String(1), nullable=False)  # 'a', 'b', 'c', or 'd'
    difficulty: Mapped[str] = mapped_column(String(10), default="medium")  # easy, medium, hard
    explanation: Mapped[str | None] = mapped_column(Text)

    # Relationships
    topic = relationship("Topic", back_populates="questions")
    practice_attempts = relationship("PracticeAttempt", back_populates="question", lazy="selectin")
    test_questions = relationship("TestQuestion", back_populates="question", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Question {self.id}>"
