import re

with open('C:/Users/ELYSIUM/Documents/VSCODE/learnmate/backend/app/api/v1/endpoints/questions.py', 'r') as f:
    content = f.read()

new_imports = """from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from app import schemas, models
from app.database import get_db
from app.auth import get_current_admin_user
"""

content = content.replace("""from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from app import schemas, models
from app.database import get_db""", new_imports)

c_u_d = """
@router.post("/", response_model=schemas.QuestionDetail)
def create_question(
    question_in: schemas.QuestionCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    \"\"\"
    Create a new question with options (Admin only).
    \"\"\"
    # Create the question
    question_data = question_in.model_dump(exclude={"options"})
    question = models.Question(**question_data)
    db.add(question)
    db.commit()
    db.refresh(question)

    # Create the options
    for opt in question_in.options:
        option = models.QuestionOption(
            question_id=question.id,
            **opt.model_dump()
        )
        db.add(option)
    
    db.commit()
    
    return get_question_detail(question.id, db)

@router.put("/{question_id}", response_model=schemas.QuestionDetail)
def update_question(
    question_id: int,
    question_in: schemas.QuestionUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    \"\"\"
    Update a question and its options (Admin only).
    \"\"\"
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    update_data = question_in.model_dump(exclude={"options"}, exclude_unset=True)
    for field, value in update_data.items():
        setattr(question, field, value)
        
    if question_in.options is not None:
        # Delete old options
        db.query(models.QuestionOption).filter(models.QuestionOption.question_id == question_id).delete()
        # Add new options
        for opt in question_in.options:
            option = models.QuestionOption(
                question_id=question.id,
                **opt.model_dump()
            )
            db.add(option)
            
    db.commit()
    return get_question_detail(question.id, db)
    
@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user),
):
    \"\"\"
    Delete a question (Admin only).
    \"\"\"
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(question)
    db.commit()
    return None
"""

with open('C:/Users/ELYSIUM/Documents/VSCODE/learnmate/backend/app/api/v1/endpoints/questions.py', 'w') as f:
    f.write(content + c_u_d)

