"""One-shot seed runner for the smoke test database."""
import sys
from app.database import SessionLocal, engine, Base
from app.scripts.seed_data import seed_subjects_and_topics, seed_sample_questions


def main():
    # Make sure all tables exist (SQLite via Base.metadata.create_all is enough
    # for the smoke test; production uses Alembic).
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_subjects_and_topics(db)
        seed_sample_questions(db)
    finally:
        db.close()
    print("Seed complete")


if __name__ == "__main__":
    sys.exit(main())
