import re

with open("app/api/v1/endpoints/mock_tests.py", "r") as f:
    text = f.read()

limit_logic = """
    # Enforce minimum 5 test attempts before AI can generate
    user_attempts_count = db.query(models.MockTestAttempt).filter(
        models.MockTestAttempt.user_id == current_user.id,
        models.MockTestAttempt.completed_at.isnot(None)
    ).count()
    
    REQUIRED_TESTS = 5
    if user_attempts_count < REQUIRED_TESTS:
        remaining = REQUIRED_TESTS - user_attempts_count
        raise HTTPException(
            status_code=400, 
            detail=f"Please complete {remaining} more mock test{'s' if remaining > 1 else ''} first so our AI can accurately analyze your weak and strong topics!"
        )
"""

if "REQUIRED_TESTS = 5" not in text:
    # Insert it right at the beginning of the route logic
    text = text.replace(
        'def generate_personalized_mock_test(\n    data: schemas.PersonalizedTestRequest,\n    current_user: models.User = Depends(get_current_active_user),\n    db: Session = Depends(get_db)\n):\n    """\n    Generate an AI personalized mock test based on PYQ weightage and user\'s weakness profile.\n    """',
        'def generate_personalized_mock_test(\n    data: schemas.PersonalizedTestRequest,\n    current_user: models.User = Depends(get_current_active_user),\n    db: Session = Depends(get_db)\n):\n    """\n    Generate an AI personalized mock test based on PYQ weightage and user\'s weakness profile.\n    """' + "\n" + limit_logic
    )

with open("app/api/v1/endpoints/mock_tests.py", "w") as f:
    f.write(text)
