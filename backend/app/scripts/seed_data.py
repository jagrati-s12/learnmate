"""
Database seeding script for LEARNMATE AI.
Populates the database with SSC JE Civil Engineering subjects, chapters, topics, and sample questions.
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Exam, Branch, Subject, Chapter, Topic, Question, QuestionOption
from app.models.question import DifficultyLevel


def seed_subjects_and_topics(db: Session):
    # 1. Create Exam
    exam = Exam(name="SSC JE", description="Staff Selection Commission Junior Engineer Exam")
    db.add(exam)
    db.flush()

    # 2. Create Branch
    branch = Branch(exam_id=exam.id, name="Civil Engineering", description="Civil Engineering Branch")
    db.add(branch)
    db.flush()

    subjects_data = [
        {
            "name": "Building Materials",
            "icon": "🏗️",
            "description": "Construction materials, their properties and applications",
            "chapters": [
                {
                    "name": "Cement",
                    "topics": ["Types of Cement", "Properties", "Tests on Cement"]
                },
                {
                    "name": "Concrete",
                    "topics": ["Workability", "Mix Design", "Tests on Concrete"]
                }
            ]
        },
        {
            "name": "Structural Engineering",
            "icon": "🌉",
            "description": "Structural analysis and design of buildings and bridges",
            "chapters": [
                {
                    "name": "Structural Analysis",
                    "topics": ["Determinacy", "SFD and BMD", "Deflection"]
                },
                {
                    "name": "RCC Design",
                    "topics": ["Beams", "Slabs", "Columns", "Footings"]
                }
            ]
        },
        {
            "name": "Geotechnical Engineering",
            "icon": "⛰️",
            "description": "Soil mechanics and foundation engineering",
            "chapters": [
                {
                    "name": "Soil Mechanics",
                    "topics": ["Properties of Soil", "Permeability", "Compaction"]
                }
            ]
        },
        {
            "name": "Fluid Mechanics & Hydraulics",
            "icon": "🌊",
            "description": "Fluid behavior, flow measurement, and hydraulic structures",
            "chapters": [
                {
                    "name": "Fluid Dynamics",
                    "topics": ["Bernoulli's Equation", "Flow Measurement"]
                }
            ]
        },
        {
            "name": "Surveying",
            "icon": "📐",
            "description": "Measurement and mapping of land surfaces",
            "chapters": [
                {
                    "name": "Levelling",
                    "topics": ["Types of Levelling", "Instruments", "Calculations"]
                }
            ]
        }
    ]

    for subj_idx, subj_data in enumerate(subjects_data):
        subject = Subject(
            branch_id=branch.id,
            name=subj_data["name"],
            icon=subj_data["icon"],
            description=subj_data["description"],
            display_order=subj_idx
        )
        db.add(subject)
        db.flush()

        for chap_idx, chap_data in enumerate(subj_data["chapters"]):
            chapter = Chapter(
                subject_id=subject.id,
                name=chap_data["name"],
                display_order=chap_idx
            )
            db.add(chapter)
            db.flush()

            for top_idx, topic_name in enumerate(chap_data["topics"]):
                topic = Topic(
                    chapter_id=chapter.id,
                    name=topic_name,
                    display_order=top_idx
                )
                db.add(topic)

    db.commit()
    print(f"✓ Seeded {len(subjects_data)} subjects with chapters and topics")


def seed_sample_questions(db: Session):
    # Sample questions database
    questions_data = [
        # Structural Analysis
        {
            "topic_name": "SFD and BMD",
            "chapter_name": "Structural Analysis",
            "subject_name": "Structural Engineering",
            "question_text": "A simply supported beam of span 8 m carries a uniformly distributed load of 20 kN/m over its entire length. The maximum bending moment in the beam will be:",
            "explanation": "For a simply supported beam with uniformly distributed load (UDL), the maximum bending moment occurs at the center and is given by: M = wL²/8\n\nWhere: w = 20 kN/m, L = 8 m\nM = (20 × 8²)/8 = (20 × 64)/8 = 160 kN-m",
            "difficulty": DifficultyLevel.EASY,
            "marks": 2,
            "options": [
                ("A", "120 kN-m"),
                ("B", "160 kN-m"),
                ("C", "180 kN-m"),
                ("D", "200 kN-m")
            ],
            "correct": "B",
            "is_pyq": True,
            "year": 2019,
            "shift": "Shift 1"
        },
        # RCC Design
        {
            "topic_name": "Beams",
            "chapter_name": "RCC Design",
            "subject_name": "Structural Engineering",
            "question_text": "The minimum percentage of steel to be provided in an RCC beam is:",
            "explanation": "According to IS 456:2000, the minimum area of tension reinforcement in a beam should be: As_min = (0.85/σsy) × bd = 0.85bd/σsy\n\nFor Fe415 steel, this works out to be approximately 0.20% of the gross cross-sectional area.",
            "difficulty": DifficultyLevel.MEDIUM,
            "marks": 1,
            "options": [
                ("A", "0.10%"),
                ("B", "0.15%"),
                ("C", "0.20%"),
                ("D", "0.25%")
            ],
            "correct": "C",
            "is_pyq": False,
            "year": None,
            "shift": None
        },
        # Soil Mechanics
        {
            "topic_name": "Properties of Soil",
            "chapter_name": "Soil Mechanics",
            "subject_name": "Geotechnical Engineering",
            "question_text": "The angle of internal friction for a saturated cohesive soil is:",
            "explanation": "For saturated cohesive soils, the angle of internal friction (φ) is approximately zero.",
            "difficulty": DifficultyLevel.MEDIUM,
            "marks": 1,
            "options": [
                ("A", "0°"),
                ("B", "10°"),
                ("C", "20°"),
                ("D", "30°")
            ],
            "correct": "A",
            "is_pyq": True,
            "year": 2020,
            "shift": "Shift 2"
        },
        # Hydraulics
        {
            "topic_name": "Bernoulli's Equation",
            "chapter_name": "Fluid Dynamics",
            "subject_name": "Fluid Mechanics & Hydraulics",
            "question_text": "Bernoulli's equation is applicable to:",
            "explanation": "Bernoulli's equation represents conservation of energy in steady, incompressible, and inviscid flow.",
            "difficulty": DifficultyLevel.EASY,
            "marks": 1,
            "options": [
                ("A", "Steady, compressible, viscous flow"),
                ("B", "Steady, incompressible, inviscid flow"),
                ("C", "Unsteady, compressible, inviscid flow"),
                ("D", "Any type of flow")
            ],
            "correct": "B",
            "is_pyq": False,
            "year": None,
            "shift": None
        },
        # Surveying
        {
            "topic_name": "Calculations",
            "chapter_name": "Levelling",
            "subject_name": "Surveying",
            "question_text": "In levelling, the term 'backsight' means:",
            "explanation": "Backsight (BS): The first reading taken on a known elevation point.",
            "difficulty": DifficultyLevel.EASY,
            "marks": 1,
            "options": [
                ("A", "First staff reading taken on a point of known elevation"),
                ("B", "Last staff reading taken on a new point"),
                ("C", "Any intermediate staff reading"),
                ("D", "Reading taken on the staff held at the instrument station")
            ],
            "correct": "A",
            "is_pyq": True,
            "year": 2018,
            "shift": "Morning"
        }
    ]

    for q_data in questions_data:
        subject = db.query(Subject).filter(Subject.name == q_data["subject_name"]).first()
        if not subject:
            continue
        chapter = db.query(Chapter).filter(Chapter.subject_id == subject.id, Chapter.name == q_data["chapter_name"]).first()
        if not chapter:
            continue
        topic = db.query(Topic).filter(Topic.chapter_id == chapter.id, Topic.name == q_data["topic_name"]).first()

        if not topic:
            print(f"⚠ Skipping question - topic not found: {q_data['topic_name']}")
            continue

        question = Question(
            topic_id=topic.id,
            question_text=q_data["question_text"],
            explanation=q_data["explanation"],
            difficulty=q_data["difficulty"],
            marks=q_data["marks"],
            is_pyq=q_data["is_pyq"],
            year=q_data["year"],
            shift=q_data["shift"]
        )
        db.add(question)
        db.flush()

        for label, text in q_data["options"]:
            option = QuestionOption(
                question_id=question.id,
                option_text=text,
                option_label=label,
                is_correct=1 if label == q_data["correct"] else 0
            )
            db.add(option)

    db.commit()
    print(f"✓ Seeded {len(questions_data)} sample questions")

def main():
    print("=" * 60)
    print("LEARNMATE AI - Database Seeding")
    print("=" * 60)

    print("\n1. Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")

    db = SessionLocal()

    try:
        print("\n2. Seeding subjects and topics...")
        seed_subjects_and_topics(db)
        print("\n3. Seeding sample questions...")
        seed_sample_questions(db)
        print("\n✓ Database seeding completed successfully!")
    except Exception as e:
        print(f"\n✗ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
