import google.generativeai as genai
from app.config import settings

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
        model = genai.GenerativeModel('gemini-1.5-flash')
        
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
