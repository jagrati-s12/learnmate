from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.question import Question
from app.models.subject import Subject
from app.models.chapter import Chapter
from app.models.topic import Topic
from app.schemas.question import QuestionResponse
from app.schemas.subject import SubjectResponse, SubjectWithChaptersResponse
from app.schemas.chapter import ChapterResponse, ChapterWithTopicsResponse
from app.schemas.topic import TopicResponse

router = APIRouter(prefix="/api", tags=["Questions & Content"])


# ---------------------------------------------------------------------------
# Questions
# ---------------------------------------------------------------------------
@router.get("/questions", response_model=list[QuestionResponse])
def list_questions(
    topic_id: int | None = Query(None, description="Filter by topic"),
    difficulty: str | None = Query(None, description="Filter by difficulty (easy, medium, hard)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List questions with optional filters for topic and difficulty."""
    query = db.query(Question)
    if topic_id is not None:
        query = query.filter(Question.topic_id == topic_id)
    if difficulty is not None:
        query = query.filter(Question.difficulty == difficulty.lower())
    return query.offset(skip).limit(limit).all()


@router.get("/questions/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    """Get a single question by ID."""
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")
    return question


# ---------------------------------------------------------------------------
# Subjects
# ---------------------------------------------------------------------------
@router.get("/subjects", response_model=list[SubjectResponse])
def list_subjects(db: Session = Depends(get_db)):
    """List all subjects."""
    return db.query(Subject).all()


@router.get("/subjects/{subject_id}", response_model=SubjectWithChaptersResponse)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    """Get a subject with its chapters."""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found.")
    return subject


# ---------------------------------------------------------------------------
# Chapters
# ---------------------------------------------------------------------------
@router.get("/chapters", response_model=list[ChapterResponse])
def list_chapters(
    subject_id: int | None = Query(None, description="Filter by subject"),
    db: Session = Depends(get_db),
):
    """List chapters, optionally filtered by subject."""
    query = db.query(Chapter)
    if subject_id is not None:
        query = query.filter(Chapter.subject_id == subject_id)
    return query.order_by(Chapter.order).all()


@router.get("/chapters/{chapter_id}", response_model=ChapterWithTopicsResponse)
def get_chapter(chapter_id: int, db: Session = Depends(get_db)):
    """Get a chapter with its topics."""
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chapter not found.")
    return chapter


# ---------------------------------------------------------------------------
# Topics
# ---------------------------------------------------------------------------
@router.get("/topics", response_model=list[TopicResponse])
def list_topics(
    chapter_id: int | None = Query(None, description="Filter by chapter"),
    db: Session = Depends(get_db),
):
    """List topics, optionally filtered by chapter."""
    query = db.query(Topic)
    if chapter_id is not None:
        query = query.filter(Topic.chapter_id == chapter_id)
    return query.order_by(Topic.order).all()


@router.get("/topics/{topic_id}", response_model=TopicResponse)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    """Get a single topic with its content."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found.")
    return topic
