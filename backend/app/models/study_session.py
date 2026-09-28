from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class UserTopicStudySession(Base):
    __tablename__ = "user_topic_study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    duration_seconds = Column(Integer, nullable=False)  # Total active seconds in this session
    activity_type = Column(String(50), default="reading") # reading, flashcard, practice, revision
    session_date = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User")
    topic = relationship("Topic")
