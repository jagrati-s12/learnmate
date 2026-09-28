from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.attempt import MockTestAttempt, QuestionAttempt
from app.models.topic_mastery import UserTopicMastery
from app.models.performance_profile import UserPerformanceProfile
from app.models.question import Question
from app.services.diagnostics.bkt_engine import update_bkt
from app.services.diagnostics.cognitive_profiler import calculate_rti, classify_cognitive_quadrant
from app.services.diagnostics.welford_detector import update_welford_stats

def evaluate_performance_updates(db: Session, user_id: int, attempt_id: int):
    """
    Background worker to process diagnostics after a test submission.
    """
    # 1. Fetch attempt and questions
    attempt = db.query(MockTestAttempt).filter(MockTestAttempt.id == attempt_id).first()
    if not attempt:
        return

    question_attempts = db.query(QuestionAttempt).filter(QuestionAttempt.mock_test_attempt_id == attempt_id).all()

    # 2. Get baseline stats for RTI (simplified: could be cached or pre-computed)
    # We need topic-wise mean/std_dev. For now, assume placeholders/defaults as per plan.
    # In production, compute these on-the-fly or cache.

    # 3. Process each question attempt
    for qa in question_attempts:
        question = db.query(Question).filter(Question.id == qa.question_id).first()
        if not question or not qa.is_correct is not None:
            continue

        topic_id = question.topic_id

        # Get or create mastery record
        mastery = db.query(UserTopicMastery).filter(
            UserTopicMastery.user_id == user_id,
            UserTopicMastery.topic_id == topic_id
        ).first()

        if not mastery:
            mastery = UserTopicMastery(user_id=user_id, topic_id=topic_id)
            db.add(mastery)
            db.flush()

        # Update BKT
        mastery.bkt_mastery_prob = update_bkt(mastery.bkt_mastery_prob, qa.is_correct)

        # Update Cognitive Load
        # Simplified RTI calculation
        rti = calculate_rti(qa.time_taken_seconds or 0, 45.0, 15.0) # Using defaults from plan
        quadrant = classify_cognitive_quadrant(rti, qa.is_correct)

        if quadrant == "Fast Master":
            mastery.fast_correct_count += 1
        elif quadrant == "Methodical":
            mastery.slow_correct_count += 1
        elif quadrant == "Speed Trap":
            mastery.fast_incorrect_count += 1
        elif quadrant == "High Load":
            mastery.slow_incorrect_count += 1

        mastery.total_attempts += 1
        if qa.is_correct:
            mastery.correct_count += 1
        else:
            mastery.incorrect_count += 1

    # 4. Update overall profile (Welford)
    profile = db.query(UserPerformanceProfile).filter(UserPerformanceProfile.user_id == user_id).first()
    if not profile:
        profile = UserPerformanceProfile(user_id=user_id)
        db.add(profile)
        db.flush()

    n, mean, m2, var, std = update_welford_stats(
        profile.tests_completed,
        profile.running_mean_score,
        profile.running_m2,
        attempt.score
    )

    profile.tests_completed = n
    profile.running_mean_score = mean
    profile.running_m2 = m2
    profile.running_variance = var
    profile.running_std_dev = std

    db.commit()
