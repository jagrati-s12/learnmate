import google.generativeai as genai
from app.config import settings
from datetime import datetime, timedelta

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_student_profile(performance_data: dict, weekly_activity: list) -> str:
    """
    Generate a personality/prep profile based on student's performance.
    """
    if not settings.GEMINI_API_KEY:
        return "AI Personality Generation requires GEMINI_API_KEY configured in environment."
        
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        prompt = f"""
        You are an expert tutor and academic coach for SSC JE Exam prep. Analyze this student's data and give them a "Candidate Profile" (like a Myers-Briggs personality but for test taking) and 3 short, actionable tips. Be encouraging but honest. Keep it under 200 words.
        
        Data:
        Overall Accuracy: {performance_data.get('accuracy', 0)}%
        Weak Topics: {[t['name'] for t in performance_data.get('weakTopics', [])]}
        Strong Topics: {[t['name'] for t in performance_data.get('strongTopics', [])]}
        
        Format your response like:
        **Your Test Profile: [Catchy Title]**
        [1 paragraph analysis]
        
        **Action Plan:**
        - [Tip 1]
        ...
        """
        
        response = model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        return f"Could not generate profile due to an AI service error: {str(e)}"

def generate_study_plan(performance_data: dict, available_hours: int, upcoming_tests: list) -> str:
    if not settings.GEMINI_API_KEY:
        return "Study plan requires GEMINI_API_KEY."
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        weak = performance_data.get('weakTopics', [])
        prompt = f"""You are an SSC JE academic coach. Create a weekly study plan for a student with {available_hours} hrs/day.
Weak topics: {[t['name'] for t in weak]}
Upcoming tests: {upcoming_tests}
Include daily focus, revision slots, and mistake-review time. Keep under 250 words."""
        return model.generate_content(prompt).text
    except Exception as e:
        return f"Study plan error: {e}"

def generate_mistake_explanation(topic: str, incorrect_answer: str, correct_answer: str) -> str:
    if not settings.GEMINI_API_KEY:
        return "Mistake explanation requires GEMINI_API_KEY."
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        prompt = f"Explain why '{incorrect_answer}' is wrong for {topic} and why '{correct_answer}' is correct. Keep under 100 words, encouraging tone."
        return model.generate_content(prompt).text
    except Exception as e:
        return f"Mistake explanation error: {e}"
