from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    icon_url: Mapped[str | None] = mapped_column(String(500))

    # Relationships
    chapters = relationship("Chapter", back_populates="subject", lazy="selectin", cascade="all, delete-orphan")
    tests = relationship("Test", back_populates="subject", lazy="selectin")
    progress_snapshots = relationship("ProgressSnapshot", back_populates="subject", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Subject {self.name}>"
