from sqlalchemy import Column, Integer, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class UserTopicMastery(Base):
    __tablename__ = "user_topic_mastery"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)

    # BKT & TMI Mastery Metrics
    bkt_mastery_prob = Column(Float, default=0.10)   # Latent mastery probability [0.0 - 1.0]
    tmi_score = Column(Float, default=0.0)           # Time-decayed mastery score [0 - 100]

    # Attempt Counts & Accuracy
    total_attempts = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    total_time_spent_seconds = Column(Integer, default=0)

    # Cognitive Load Counts
    fast_correct_count = Column(Integer, default=0)   # Quad 1: Mastered
    slow_correct_count = Column(Integer, default=0)   # Quad 2: Methodical
    fast_incorrect_count = Column(Integer, default=0) # Quad 3: Rushed/Slip
    slow_incorrect_count = Column(Integer, default=0) # Quad 4: Conceptual Struggle

    last_practiced_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")
    topic = relationship("Topic")
