from sqlalchemy.orm import Session
from sqlalchemy import func
import random
import math

from app.models import MockTestAttempt, QuestionAttempt, Question, Topic, Subject, Chapter
from app.models.mock_test import MockTest, MockTestType, MockTestQuestion

def calculate_pyq_baseline_weights(db: Session, branch_id: int):
    """
    In a fully hydrated database, this would query all questions where is_pyq=True
    and calculate exact topic frequencies. 
    As a fallback, we use known SSC JE Civil historic averages.
    """
    
    # Query database to check if we have enough PYQs to calculate dynamically
    pyq_topic_counts = db.query(
        Topic.id, 
        Topic.name, 
        func.count(Question.id).label("count")
    ).join(Question, Topic.id == Question.topic_id)\
     .filter(Question.is_pyq == True)\
     .group_by(Topic.id, Topic.name).all()
     
    total_pyqs = sum([row.count for row in pyq_topic_counts])
    
    weights = {}
    if total_pyqs > 100:  # We have enough data
        for row in pyq_topic_counts:
            weights[row.id] = row.count / total_pyqs
    else:
        # Fallback dictionary simulating standard SSC-JE Civil weightages mapped to subjects
        # Normally you'd map these accurately. Here we just distribute evenly or simulated.
        topics = db.query(Topic).join(Chapter).join(Subject).filter(Subject.branch_id == branch_id).all()
        # Fallback distribution logic
        for t in topics:
            subject_name = t.chapter.subject.name.lower()
            weight = 0.05
            if "material" in subject_name or "bmc" in subject_name: weight = 0.16
            elif "soil" in subject_name: weight = 0.10
            elif "fluid" in subject_name: weight = 0.10
            elif "survey" in subject_name: weight = 0.10
            elif "transportation" in subject_name: weight = 0.10
            elif "rcc" in subject_name: weight = 0.10
            elif "steel" in subject_name: weight = 0.08
            
            # Divide subject weight amongst its topics evenly
            subject_topics_count = len(t.chapter.subject.chapters) * 2 # rough approx
            weights[t.id] = weight / max(subject_topics_count, 1)

    return weights


def calculate_user_weaknesses(db: Session, user_id: int):
    """
    Analyzes user's last 5 test attempts to find weak topics.
    Returns dict: topic_id -> weakness_score (0.0 to 1.0, where 1.0 means very weak)
    """
    recent_attempts = db.query(MockTestAttempt).filter(
        MockTestAttempt.user_id == user_id,
        MockTestAttempt.completed_at.isnot(None)
    ).order_by(MockTestAttempt.completed_at.desc()).limit(5).all()
    
    attempt_ids = [a.id for a in recent_attempts]
    
    if not attempt_ids:
        return {} # No history
        
    q_attempts = db.query(
        Question.topic_id,
        func.count(QuestionAttempt.id).label("total"),
        func.sum(func.cast(QuestionAttempt.is_correct, func.integer())).label("correct")
    ).join(Question, QuestionAttempt.question_id == Question.id)\
     .filter(QuestionAttempt.mock_test_attempt_id.in_(attempt_ids))\
     .group_by(Question.topic_id).all()
     
    weakness_scores = {}
    for row in q_attempts:
        if row.total > 0:
            accuracy = row.correct / row.total
            weakness_scores[row.topic_id] = 1.0 - accuracy # Higher score = weaker
            
    return weakness_scores


def generate_personalized_test_distribution(
    db: Session, 
    user_id: int, 
    branch_id: int, 
    total_questions: int,
    adaptation_weight: float = 0.5
):
    """
    Combines PYQ weights and User weaknesses to determine the number of questions per topic.
    Returns dict: topic_id -> question_count
    """
    pyq_weights = calculate_pyq_baseline_weights(db, branch_id)
    user_weaknesses = calculate_user_weaknesses(db, user_id)
    
    final_weights = {}
    
    all_topics = set(pyq_weights.keys()).union(set(user_weaknesses.keys()))
    
    for t_id in all_topics:
        p_wt = pyq_weights.get(t_id, 0.02) # base small weight
        
        # If user has a weakness score, blend it. 
        # If no weakness score, assume average (0.5)
        u_weak = user_weaknesses.get(t_id, 0.5)
        
        # Combine: PYQ weight * (influence of weakness)
        # We boost topics that are historically important AND the user is weak at
        final_score = p_wt * (1.0 + (u_weak * adaptation_weight))
        final_weights[t_id] = final_score
        
    # Normalize final weights
    total_score = sum(final_weights.values())
    
    distribution = {}
    remaining_qs = total_questions
    
    # Calculate initial distribution using floor
    for t_id, score in final_weights.items():
        normalized = score / total_score if total_score > 0 else 0
        allocated = math.floor(normalized * total_questions)
        distribution[t_id] = allocated
        remaining_qs -= allocated
        
    # Distribute remainder to highest fractional parts
    fractional = {
        t_id: ((score / total_score * total_questions) - math.floor(score / total_score * total_questions))
        for t_id, score in final_weights.items()
    }
    sorted_fracts = sorted(fractional.items(), key=lambda x: x[1], reverse=True)
    
    for i in range(remaining_qs):
        if i < len(sorted_fracts):
            distribution[sorted_fracts[i][0]] += 1
            
    return distribution


def build_mock_test_from_distribution(
    db: Session, 
    user_id: int,
    name: str, 
    description: str,
    total_questions: int, 
    distribution: dict
) -> MockTest:
    
    mock_test = MockTest(
        name=name,
        description=description,
        test_type=MockTestType.CUSTOM,
        duration_minutes=total_questions * 1.2, # Rough standard estimate
        total_marks=total_questions,
        negative_marking=0.25
    )
    db.add(mock_test)
    db.flush() # get ID
    
    order = 1
    for topic_id, count in distribution.items():
        if count <= 0: continue
        
        # Avoid questions user has already recently attempted
        recent_q_attempts_sq = db.query(QuestionAttempt.question_id).filter(
            QuestionAttempt.user_id == user_id
        ).subquery()
        
        qs = db.query(Question).filter(
            Question.topic_id == topic_id,
            Question.id.notin_(recent_q_attempts_sq)
        ).order_by(func.random()).limit(count).all()
        
        # Fallback: if not enough fresh questions, just pick any random ones
        if len(qs) < count:
            remaining = count - len(qs)
            exclude_ids = [q.id for q in qs]
            more_qs = db.query(Question).filter(
                Question.topic_id == topic_id,
                Question.id.notin_(exclude_ids)
            ).order_by(func.random()).limit(remaining).all()
            qs.extend(more_qs)
            
        for q in qs:
            mtq = MockTestQuestion(
                mock_test_id=mock_test.id,
                question_id=q.id,
                question_order=order
            )
            db.add(mtq)
            order += 1
            
    db.commit()
    db.refresh(mock_test)
    return mock_test

