"""
Database seeding script for LEARNMATE AI.
Populates the database with SSC JE Civil Engineering subjects, topics, and sample questions.
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Subject, Topic, Question, QuestionOption
from app.models.question import DifficultyLevel


def seed_subjects_and_topics(db: Session):
    """Create SSC JE Civil Engineering subjects and topics"""

    subjects_data = [
        {
            "name": "Building Materials",
            "icon": "🏗️",
            "description": "Construction materials, their properties and applications",
            "topics": [
                "Cement",
                "Aggregates",
                "Bricks and Blocks",
                "Concrete",
                "Steel",
                "Timber",
                "Paints and Varnishes"
            ]
        },
        {
            "name": "Structural Engineering",
            "icon": "🌉",
            "description": "Structural analysis and design of buildings and bridges",
            "topics": [
                "Structural Analysis",
                "RCC Design",
                "Steel Structure Design",
                "Timber Structure",
                "Bridges"
            ]
        },
        {
            "name": "Geotechnical Engineering",
            "icon": "⛰️",
            "description": "Soil mechanics and foundation engineering",
            "topics": [
                "Soil Mechanics",
                "Foundation Engineering",
                "Earth Pressure",
                "Bearing Capacity",
                "Slope Stability"
            ]
        },
        {
            "name": "Environmental Engineering",
            "icon": "💧",
            "description": "Water supply, sanitation, and environmental management",
            "topics": [
                "Water Supply",
                "Sanitary Engineering",
                "Sewage Treatment",
                "Air Pollution",
                "Noise Pollution"
            ]
        },
        {
            "name": "Transportation Engineering",
            "icon": "🛣️",
            "description": "Highways, railways, and transportation systems",
            "topics": [
                "Highway Planning",
                "Traffic Engineering",
                "Pavement Design",
                "Railways",
                "Bridges"
            ]
        },
        {
            "name": "Fluid Mechanics & Hydraulics",
            "icon": "🌊",
            "description": "Fluid behavior, flow measurement, and hydraulic structures",
            "topics": [
                "Fluid Properties",
                "Fluid Statics",
                "Fluid Kinematics",
                "Fluid Dynamics",
                "Open Channel Flow",
                "Hydraulic Machines"
            ]
        },
        {
            "name": "Surveying",
            "icon": "📐",
            "description": "Measurement and mapping of land surfaces",
            "topics": [
                "Chain Surveying",
                "Compass Surveying",
                "Theodolite",
                "Levelling",
                "Modern Surveying"
            ]
        }
    ]

    for subj_data in subjects_data:
        subject = Subject(
            name=subj_data["name"],
            icon=subj_data["icon"],
            description=subj_data["description"],
            display_order=subjects_data.index(subj_data)
        )
        db.add(subject)
        db.flush()  # Get subject.id

        for idx, topic_name in enumerate(subj_data["topics"]):
            topic = Topic(
                subject_id=subject.id,
                name=topic_name,
                display_order=idx
            )
            db.add(topic)

    db.commit()
    print(f"✓ Seeded {len(subjects_data)} subjects with topics")


def seed_sample_questions(db: Session):
    """Create sample questions for each topic"""

    # Sample questions database
    questions_data = [
        # Structural Analysis
        {
            "topic_name": "Structural Analysis",
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
            "correct": "B"
        },
        # RCC Design
        {
            "topic_name": "RCC Design",
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
            "correct": "C"
        },
        # Soil Mechanics
        {
            "topic_name": "Soil Mechanics",
            "subject_name": "Geotechnical Engineering",
            "question_text": "The angle of internal friction for a saturated cohesive soil is:",
            "explanation": "For saturated cohesive soils, the angle of internal friction (φ) is approximately zero, which is a fundamental property used in soil mechanics. This is why such soils are analyzed using undrained shear strength (cu) parameters.",
            "difficulty": DifficultyLevel.MEDIUM,
            "marks": 1,
            "options": [
                ("A", "0°"),
                ("B", "10°"),
                ("C", "20°"),
                ("D", "30°")
            ],
            "correct": "A"
        },
        # Hydraulics
        {
            "topic_name": "Fluid Dynamics",
            "subject_name": "Fluid Mechanics & Hydraulics",
            "question_text": "Bernoulli's equation is applicable to:",
            "explanation": "Bernoulli's equation is applicable to:\n1. Steady flow\n2. Incompressible flow\n3. Inviscid (frictionless) flow\n4. Flow along a streamline\n\nIt represents the conservation of energy in fluid flow.",
            "difficulty": DifficultyLevel.EASY,
            "marks": 1,
            "options": [
                ("A", "Steady, compressible, viscous flow"),
                ("B", "Steady, incompressible, inviscid flow"),
                ("C", "Unsteady, compressible, inviscid flow"),
                ("D", "Any type of flow")
            ],
            "correct": "B"
        },
        # Surveying
        {
            "topic_name": "Levelling",
            "subject_name": "Surveying",
            "question_text": "In levelling, the term 'backsight' means:",
            "explanation": "In levelling operations:\n- Backsight (BS): The first reading taken on a known elevation point (benchmark) after setting up the instrument\n- Foresight (FS): The last reading taken on a new point before shifting the instrument\n- Intermediate sight (IS): Any other reading taken between BS and FS",
            "difficulty": DifficultyLevel.EASY,
            "marks": 1,
            "options": [
                ("A", "First staff reading taken on a point of known elevation"),
                ("B", "Last staff reading taken on a new point"),
                ("C", "Any intermediate staff reading"),
                ("D", "Reading taken on the staff held at the instrument station")
            ],
            "correct": "A"
        }
    ]

    for q_data in questions_data:
        # Find subject and topic
        subject = db.query(Subject).filter(Subject.name == q_data["subject_name"]).first()
        topic = db.query(Topic).filter(
            Topic.subject_id == subject.id,
            Topic.name == q_data["topic_name"]
        ).first()

        if not subject or not topic:
            print(f"⚠ Skipping question - subject/topic not found: {q_data['topic_name']}")
            continue

        # Create question
        question = Question(
            topic_id=topic.id,
            question_text=q_data["question_text"],
            explanation=q_data["explanation"],
            difficulty=q_data["difficulty"],
            marks=q_data["marks"]
        )
        db.add(question)
        db.flush()

        # Create options
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
    """Main seeding function"""
    print("=" * 60)
    print("LEARNMATE AI - Database Seeding")
    print("=" * 60)

    # Create all tables
    print("\n1. Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")

    # Create session
    db = SessionLocal()

    try:
        # Seed subjects and topics
        print("\n2. Seeding subjects and topics...")
        seed_subjects_and_topics(db)

        # Seed sample questions
        print("\n3. Seeding sample questions...")
        seed_sample_questions(db)

        print("\n" + "=" * 60)
        print("✓ Database seeding completed successfully!")
        print("=" * 60)

    except Exception as e:
        print(f"\n✗ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
