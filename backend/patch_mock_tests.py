import re

with open("app/api/v1/endpoints/mock_tests.py", "r") as f:
    content = f.read()

# Add AI endpoint import to top
import_statement = "from app.services.ai_test_generator import generate_personalized_test_distribution, build_mock_test_from_distribution"
if import_statement not in content:
    content = content.replace("from app.database import get_db\n", 
                              f"from app.database import get_db\n{import_statement}\n")

# Add the new endpoint
new_endpoint = '''
@router.post("/generate-personalized", response_model=schemas.MockTestResponse)
def generate_personalized_mock_test(
    data: schemas.PersonalizedTestRequest,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Generate an AI personalized mock test based on PYQ weightage and user's weakness profile.
    """
    # 1. Get ideal distribution
    distribution = generate_personalized_test_distribution(
        db=db,
        user_id=current_user.id,
        branch_id=data.branch_id,
        total_questions=data.total_questions,
        adaptation_weight=data.adaptation_weight
    )
    
    # 2. Build the test
    mock_test = build_mock_test_from_distribution(
        db=db,
        user_id=current_user.id,
        name=data.name or "AI Personalized Mock Test",
        description=data.description,
        total_questions=data.total_questions,
        distribution=distribution
    )
    
    return mock_test
'''

if "generate_personalized_mock_test" not in content:
    content += new_endpoint

with open("app/api/v1/endpoints/mock_tests.py", "w") as f:
    f.write(content)
