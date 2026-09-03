from fastapi import HTTPException
import random

@router.post("/generate", response_model=schemas.MockTestResponse)
def generate_mock_test(
    data: schemas.MockTestGenerateRequest,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Generate a dynamic mock test by picking random questions.
    Admin only (or we can allow users to generate custom tests).
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to generate global mock tests")

    # Build query for questions based on hierarchy
    q_query = db.query(models.Question)
    
    if data.subject_id:
        q_query = q_query.join(models.Topic).join(models.Chapter).filter(models.Chapter.subject_id == data.subject_id)
    elif data.branch_id:
        q_query = q_query.join(models.Topic).join(models.Chapter).join(models.Subject).filter(models.Subject.branch_id == data.branch_id)
    elif data.exam_id:
        q_query = q_query.join(models.Topic).join(models.Chapter).join(models.Subject).join(models.Branch).filter(models.Branch.exam_id == data.exam_id)

    available_questions = q_query.all()
    
    if len(available_questions) < data.total_questions:
        raise HTTPException(status_code=400, detail=f"Not enough questions available. Found {len(available_questions)}, requested {data.total_questions}")

    selected_questions = random.sample(available_questions, data.total_questions)

    # Calculate marks dynamically or use defined
    # We will use defined total_marks from request to match the actual exam
    # Alternatively we can sum(q.marks) but standard exams have fixed marks per question.
    
    mock_test = models.MockTest(
        name=data.name,
        description=data.description,
        test_type=data.test_type,
        duration_minutes=data.duration_minutes,
        total_marks=data.total_marks,
        negative_marking=data.negative_marking
    )
    db.add(mock_test)
    db.commit()
    db.refresh(mock_test)

    # Link questions
    for order, sq in enumerate(selected_questions, start=1):
        mtq = models.MockTestQuestion(
            mock_test_id=mock_test.id,
            question_id=sq.id,
            question_order=order
        )
        db.add(mtq)
    
    db.commit()
    return mock_test
