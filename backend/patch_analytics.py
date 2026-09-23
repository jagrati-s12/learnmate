import re

with open("app/api/v1/endpoints/analytics.py", "r") as f:
    content = f.read()

import_statement = "from app.services.ai_personality import generate_student_profile"
if import_statement not in content:
    content = content.replace("from app.database import get_db\n", 
                              f"from app.database import get_db\n{import_statement}\n")

new_endpoint = '''
@router.get("/ai-profile")
def get_ai_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Reuse existing data functions (hackish but avoids duplication for now)
    perf_data = get_performance(current_user, db)
    weekly_data = get_weekly_activity(current_user, db)
    
    profile_text = generate_student_profile(perf_data, weekly_data)
    
    return {
        "profile": profile_text
    }
'''

if "get_ai_profile" not in content:
    content += new_endpoint

with open("app/api/v1/endpoints/analytics.py", "w") as f:
    f.write(content)
