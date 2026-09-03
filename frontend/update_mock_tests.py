import re

with open('C:/Users/ELYSIUM/Documents/VSCODE/learnmate/backend/app/api/v1/endpoints/mock_tests.py', 'r') as f:
    content = f.read()

new_imports = """from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import random
from datetime import datetime

from app import schemas, models
from app.database import get_db
from app.auth import get_current_active_user, get_current_admin_user
"""

content = content.replace("""from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import random
from datetime import datetime

from app import schemas, models
from app.database import get_db
from app.auth import get_current_active_user
""", new_imports)

c_u_d = """
@router.post("/", response_model=schemas.MockTestResponse)
def create_mock_test(
    data: schemas.MockTestCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    \"\"\"
    Create a new empty mock test (Admin only).
    \"\"\"
    mock_test = models.MockTest(**data.model_dump())
    db.add(mock_test)
    db.commit()
    db.refresh(mock_test)
    return mock_test

@router.put("/{test_id}", response_model=schemas.MockTestResponse)
def update_mock_test(
    test_id: int,
    data: schemas.MockTestUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    \"\"\"
    Update an existing mock test metadata (Admin only).
    \"\"\"
    mock_test = db.query(models.MockTest).filter(models.MockTest.id == test_id).first()
    if not mock_test:
        raise HTTPException(status_code=404, detail="Mock test not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(mock_test, field, value)

    db.commit()
    db.refresh(mock_test)
    return mock_test

@router.delete("/{test_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_mock_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    \"\"\"
    Delete a mock test (Admin only).
    \"\"\"
    mock_test = db.query(models.MockTest).filter(models.MockTest.id == test_id).first()
    if not mock_test:
        raise HTTPException(status_code=404, detail="Mock test not found")

    db.delete(mock_test)
    db.commit()
    return None
"""

with open('C:/Users/ELYSIUM/Documents/VSCODE/learnmate/backend/app/api/v1/endpoints/mock_tests.py', 'a') as f:
    f.write(c_u_d)

with open('C:/Users/ELYSIUM/Documents/VSCODE/learnmate/backend/app/api/v1/endpoints/mock_tests.py', 'w') as f:
    f.write(content + c_u_d)

