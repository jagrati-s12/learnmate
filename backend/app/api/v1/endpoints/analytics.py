from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.services.ai_personality import generate_student_profile, generate_study_plan, generate_mistake_explanation
from app.models.user import User
from app.models.attempt import MockTestAttempt, QuestionAttempt
from app.models.question import Question
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.chapter import Chapter
from app.models.user_profile import UserWeaknessProfile
from app.auth import get_current_user

router = APIRouter()

@router.post("/study-session/heartbeat")
def post_study_session_heartbeat(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.study_session import UserTopicStudySession

    topic_id = data.get("topic_id")
    duration = data.get("duration_seconds")
    activity_type = data.get("activity_type", "reading")

    study_session = UserTopicStudySession(
        user_id=current_user.id,
        topic_id=topic_id,
        duration_seconds=duration,
        activity_type=activity_type
    )
    db.add(study_session)
    db.commit()

    return {"status": "success"}

@router.get("/dashboard-stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attempts = db.query(MockTestAttempt).filter(MockTestAttempt.user_id == current_user.id).all()
    q_attempts = db.query(QuestionAttempt).filter(QuestionAttempt.user_id == current_user.id).count()
    
    # Calculate real syllabus completion (attempted topics / total topics)
    total_topics = db.query(Topic).count()
    attempted_topics = db.query(Topic.id)        .join(Question, Topic.id == Question.topic_id)        .join(QuestionAttempt, Question.id == QuestionAttempt.question_id)        .filter(QuestionAttempt.user_id == current_user.id)        .distinct().count()
        
    syllabus_completion = round((attempted_topics / total_topics * 100)) if total_topics > 0 else 0
    
    # Add scattered question time (assume 2 mins per question attempt not in mock test)
    # This is a simplification.
    total_time_seconds = sum([a.total_time_seconds or 0 for a in attempts]) + (q_attempts * 120)
    
    # Calculate streak appropriately (count unique days with attempts)
    from sqlalchemy import func, cast, Date
    unique_days = db.query(cast(QuestionAttempt.attempted_at, Date))        .filter(QuestionAttempt.user_id == current_user.id)        .distinct().count()

    # Also add mock test days
    mock_days = db.query(cast(MockTestAttempt.started_at, Date))        .filter(MockTestAttempt.user_id == current_user.id)        .distinct().count()
        
    streak = max(unique_days, mock_days)
    
    return {
        "syllabus_completion_percent": syllabus_completion,
        "total_study_time_hours": round(total_time_seconds / 3600, 1),
        "pyqs_solved": q_attempts, 
        "streak_days": streak
    }

@router.get("/weekly-activity")
def get_weekly_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from datetime import datetime, timedelta
    
    # Generate last 7 days
    result = []
    today = datetime.now().date()
    
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        
        # Get attempts for this day
        from sqlalchemy import func, cast, Date
        
        # We don't have explicit sessions, so assume each QuestionAttempt takes 2 mins
        # or mock test attempts take their time
        mock_time = db.query(func.sum(MockTestAttempt.total_time_seconds)).filter(
            MockTestAttempt.user_id == current_user.id,
            cast(MockTestAttempt.completed_at, Date) == day
        ).scalar() or 0

        q_count = db.query(func.count(QuestionAttempt.id)).filter(
            QuestionAttempt.user_id == current_user.id,
            cast(QuestionAttempt.attempted_at, Date) == day
        ).scalar() or 0
        
        # approximate 2 min per q attempt if not in test
        total_seconds = mock_time + (q_count * 120)
        hours = round(total_seconds / 3600, 1)
        
        day_str = day.strftime("%a") # Mon, Tue
        result.append({"day": day_str, "hours": hours})
        
    return result

@router.get("/performance")
def get_performance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Overall score/accuracy
    attempts = db.query(MockTestAttempt).filter(
        MockTestAttempt.user_id == current_user.id,
        MockTestAttempt.completed_at.isnot(None)
    ).all()
    
    total_correct = sum(a.correct_answers for a in attempts)
    total_incorrect = sum(a.incorrect_answers for a in attempts)
    total_attempted = total_correct + total_incorrect
    
    accuracy = round((total_correct / total_attempted * 100)) if total_attempted > 0 else 0
    overall_score = round(sum(a.score for a in attempts) / len(attempts)) if attempts else 0
    
    # Topic level (simplified for now to aggregate subjects)
    # Get all question attempts joined with subject
    from sqlalchemy.orm import aliased
    from sqlalchemy import case
    
    q_attempts = db.query(
        Subject.name,
        func.count(QuestionAttempt.id).label('total_attempted'),
        func.sum(case((QuestionAttempt.is_correct == True, 1), else_=0)).label('correct')
    ).select_from(QuestionAttempt)\
     .join(Question)\
     .join(Topic, Question.topic_id == Topic.id)\
     .join(Chapter, Topic.chapter_id == Chapter.id)\
     .join(Subject, Chapter.subject_id == Subject.id)\
     .filter(QuestionAttempt.user_id == current_user.id)\
     .group_by(Subject.name).all()
     
    topics_stats = []
    for qa in q_attempts:
        topics_stats.append({
            "name": qa.name,
            "totalAttempted": qa.total_attempted,
            "accuracy": round((qa.correct / qa.total_attempted * 100)) if qa.total_attempted > 0 else 0
        })
        
    topics_stats.sort(key=lambda x: x['accuracy'])
    weak = topics_stats[:3]
    strong = topics_stats[-3:] if len(topics_stats) > 3 else topics_stats
    
    return {
        "overallScore": overall_score,
        "accuracy": accuracy,
        "percentile": round(accuracy * 0.95), # Computed relative to accuracy for now
        "weakTopics": weak,
        "strongTopics": strong
    }

@router.get("/progress")
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Total topics per subject vs attempted topics
    subjects = db.query(Subject).filter(Subject.branch_id == 2).all()
    result = []
    
    for sub in subjects:
        total_topics = db.query(Topic).join(Chapter).filter(Chapter.subject_id == sub.id).count()
        # Find topics where user attempted at least 1 question
        attempted_topics = db.query(Topic.id)\
            .join(Question, Topic.id == Question.topic_id)\
            .join(QuestionAttempt, Question.id == QuestionAttempt.question_id)\
            .join(Chapter, Topic.chapter_id == Chapter.id)\
            .filter(QuestionAttempt.user_id == current_user.id, Chapter.subject_id == sub.id)\
            .distinct().count()
            
        progress = round((attempted_topics / total_topics * 100)) if total_topics > 0 else 0
        
        result.append({
            "subject": sub.name,
            "totalTopics": total_topics,
            "completedTopics": attempted_topics,
            "progress": progress
        })
        
    return result


@router.get("/topic-progress")
def get_topic_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate progress for each topic (total vs attempted questions)
    
    # Get total questions per topic
    total_q = db.query(Question.topic_id, func.count(Question.id).label('total'))        .group_by(Question.topic_id).all()
        
    total_dict = {t.topic_id: t.total for t in total_q}
    
    # Get attempted questions per topic for user
    attempted_q = db.query(Question.topic_id, func.count(func.distinct(QuestionAttempt.question_id)).label('attempted'))        .join(QuestionAttempt, Question.id == QuestionAttempt.question_id)        .filter(QuestionAttempt.user_id == current_user.id)        .group_by(Question.topic_id).all()
        
    attempted_dict = {a.topic_id: a.attempted for a in attempted_q}
    
    result = []
    topics = db.query(Topic).all()
    
    for t in topics:
        total = total_dict.get(t.id, 0)
        attempted = attempted_dict.get(t.id, 0)
        progress = round((attempted / total * 100)) if total > 0 else 0
        
        result.append({
            "topic_id": t.id,
            "progress": progress
        })
        
    return result

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

@router.get("/weakness-profile")
def get_weakness_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profiles = db.query(UserWeaknessProfile).filter(UserWeaknessProfile.user_id == current_user.id).all()
    result = []
    for p in profiles:
        result.append({
            "topic_id": p.topic_id,
            "weakness_score": p.weakness_score,
            "trend": p.trend,
            "total_attempted": p.total_attempted,
            "total_correct": p.total_correct
        })
    return {"topics": result}

@router.post("/generate-study-plan")
def post_study_plan(current_user: User = Depends(get_current_user), db: Session = Depends(get_db), data: dict = None):
    perf = get_performance(current_user, db)
    hours = data.get("available_hours", 2) if data else 2
    upcoming = data.get("upcoming_tests", []) if data else []
    return {"plan": generate_study_plan(perf, hours, upcoming)}

@router.post("/mistake-explanation")
def post_mistake_explanation(current_user: User = Depends(get_current_user), db: Session = Depends(get_db), data: dict = None):
    topic = data.get("topic", "") if data else ""
    wrong = data.get("incorrect_answer", "") if data else ""
    correct = data.get("correct_answer", "") if data else ""
    return {"explanation": generate_mistake_explanation(topic, wrong, correct)}

@router.get("/performance-overview")
def get_performance_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.performance_profile import UserPerformanceProfile
    from app.models.topic_mastery import UserTopicMastery
    from app.models.study_session import UserTopicStudySession

    profile = db.query(UserPerformanceProfile).filter(
        UserPerformanceProfile.user_id == current_user.id
    ).first()

    if not profile:
        profile = UserPerformanceProfile(user_id=current_user.id)

    # Compute Cognitive Load Summary percentages across topic mastery records
    masteries = db.query(UserTopicMastery).filter(UserTopicMastery.user_id == current_user.id).all()
    total_fast_correct = sum(m.fast_correct_count for m in masteries)
    total_slow_correct = sum(m.slow_correct_count for m in masteries)
    total_fast_incorrect = sum(m.fast_incorrect_count for m in masteries)
    total_slow_incorrect = sum(m.slow_incorrect_count for m in masteries)
    total_quad_attempts = total_fast_correct + total_slow_correct + total_fast_incorrect + total_slow_incorrect

    cognitive_summary = {
        "mastered_fast_pct": round((total_fast_correct / total_quad_attempts * 100), 1) if total_quad_attempts > 0 else 0.0,
        "methodical_slow_pct": round((total_slow_correct / total_quad_attempts * 100), 1) if total_quad_attempts > 0 else 0.0,
        "rushed_errors_pct": round((total_fast_incorrect / total_quad_attempts * 100), 1) if total_quad_attempts > 0 else 0.0,
        "conceptual_struggles_pct": round((total_slow_incorrect / total_quad_attempts * 100), 1) if total_quad_attempts > 0 else 0.0,
    }

    # Priority Revision Topics (topics needing attention)
    priority_topics = []
    weak_masteries = db.query(UserTopicMastery).filter(
        UserTopicMastery.user_id == current_user.id,
        UserTopicMastery.bkt_mastery_prob < 0.50
    ).order_by(UserTopicMastery.bkt_mastery_prob.asc()).limit(5).all()

    for m in weak_masteries:
        topic = db.query(Topic).filter(Topic.id == m.topic_id).first()
        topic_name = topic.name if topic else f"Topic #{m.topic_id}"
        subject_name = topic.chapter.subject.name if (topic and topic.chapter and topic.chapter.subject) else "General"

        # Calculate study time for this topic
        total_seconds = db.query(func.sum(UserTopicStudySession.duration_seconds)).filter(
            UserTopicStudySession.user_id == current_user.id,
            UserTopicStudySession.topic_id == m.topic_id
        ).scalar() or 0
        study_hours = round(total_seconds / 3600, 1)

        # Root cause attribution matrix logic
        if study_hours < 1.0:
            root_cause = "Knowledge Gap"
            note = f"Low study time ({study_hours} hrs) and low mastery ({round(m.bkt_mastery_prob*100)}%). Insufficient preparation."
            action = "Study Theory & Practice 10 Basic Questions"
        elif m.fast_incorrect_count > m.slow_incorrect_count:
            root_cause = "Speed/Careless Trap"
            note = "High rushed slip rate. Speed reading led to careless error."
            action = "Slow down and re-read question conditions carefully."
        else:
            root_cause = "Misunderstanding"
            note = f"High study time ({study_hours} hrs) but low concept mastery ({round(m.bkt_mastery_prob*100)}%). Conceptual re-training required."
            action = "Watch Concept Explainer & Attempt Solved Examples"

        priority_topics.append({
            "topic_id": m.topic_id,
            "topic_name": topic_name,
            "subject_name": subject_name,
            "tmi_score": m.tmi_score,
            "bkt_mastery_prob": m.bkt_mastery_prob,
            "study_hours": study_hours,
            "root_cause": root_cause,
            "diagnostic_note": note,
            "action_plan": action
        })

    return {
        "user_id": current_user.id,
        "overall_summary": {
            "total_tests_completed": profile.tests_completed,
            "average_score": profile.running_mean_score,
            "running_std_dev": profile.running_std_dev,
            "predicted_next_score": profile.predicted_mock_score,
            "velocity_trend": profile.trend_direction,
            "score_velocity": profile.score_velocity,
            "burnout_risk": profile.burnout_flag,
            "student_archetype": profile.archetype
        },
        "cognitive_load_summary": cognitive_summary,
        "priority_revision_topics": priority_topics
    }

@router.get("/topic-breakdown")
def get_topic_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.topic_mastery import UserTopicMastery

    masteries = db.query(UserTopicMastery).filter(
        UserTopicMastery.user_id == current_user.id
    ).all()

    result = []
    for m in masteries:
        topic = db.query(Topic).filter(Topic.id == m.topic_id).first()
        result.append({
            "topic_id": m.topic_id,
            "topic_name": topic.name if topic else f"Topic #{m.topic_id}",
            "bkt_mastery_prob": m.bkt_mastery_prob,
            "tmi_score": m.tmi_score,
            "total_attempts": m.total_attempts,
            "correct_count": m.correct_count,
            "incorrect_count": m.incorrect_count,
            "quadrants": {
                "fast_correct": m.fast_correct_count,
                "slow_correct": m.slow_correct_count,
                "fast_incorrect": m.fast_incorrect_count,
                "slow_incorrect": m.slow_incorrect_count
            },
            "last_practiced_at": m.last_practiced_at
        })
    return {"topics": result}


