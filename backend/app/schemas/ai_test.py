from pydantic import BaseModel
from typing import Optional

class PersonalizedTestRequest(BaseModel):
    branch_id: int
    total_questions: int = 100
    adaptation_weight: float = 0.5
    name: Optional[str] = "AI Personalized PYQ Mock Test"
    description: Optional[str] = "Auto-generated based on PYQ weightage and user weaknesses"
