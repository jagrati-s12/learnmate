import sys
sys.path.append('.')
from app.database import SessionLocal
from app.services.ai_test_generator import generate_personalized_test_distribution, build_mock_test_from_distribution
from app.models.user import User

db = SessionLocal()

# Pick any user (e.g. user id 1) to simulate the AI adaptation, or admin
user = db.query(User).first()
if not user:
    print("No users found in database.")
    sys.exit(1)

print(f"Generating for user: {user.full_name} (ID: {user.id})")
branch_id = 1 # or 2, assuming 2 is Civil Engineering

# 1. Calculate distribution
distribution = generate_personalized_test_distribution(
    db=db,
    user_id=user.id,
    branch_id=branch_id,
    total_questions=100,
    adaptation_weight=0.5
)

# 2. Build Mock Test in DB
mock_test = build_mock_test_from_distribution(
    db=db,
    user_id=user.id,
    name="AI Ultimate Personalized Mock Test",
    description="Automatically generated based on 5yr PYQ trends and your recent weak spots.",
    total_questions=100,
    distribution=distribution
)

print(f"SUCCESS! Created MockTest ID: {mock_test.id}")
print(f"Test Name: {mock_test.name}")
print(f"Questions distributed across {len(distribution.keys())} unique topics.")
