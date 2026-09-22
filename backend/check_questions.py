import sys
sys.path.append('.')
from app.database import SessionLocal
from app.models.question import Question
from sqlalchemy import func

db = SessionLocal()

total_q = db.query(func.count(Question.id)).scalar()
pyq_count = db.query(func.count(Question.id)).filter(Question.is_pyq == True).scalar()

sample = db.query(Question).limit(5).all()
sample_data = [{"id": q.id, "text": q.question_text[:50], "is_pyq": q.is_pyq} for q in sample]

print(f"Total Questions: {total_q}")
print(f"Questions labeled as PYQ: {pyq_count}")
for s in sample_data:
    print(s)
