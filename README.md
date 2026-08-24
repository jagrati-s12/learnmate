# LearnMate — SSC JE Civil Edition

This version replaces the original DSA-focused content with an SSC JE Civil preparation experience.

## What changed

- Dashboard → SSC JE Civil preparation dashboard
- Subjects → Civil Engineering subjects
- Practice → Civil PYQs/practice
- AI Tutor → Civil-focused AI Tutor
- Goals → SSC JE preparation goals
- Notes → Civil Engineering notes
- Flashcards → Civil formulas/concepts
- Settings → SSC JE Civil preferences
- Sidebar/topbar → SSC JE Civil branding
- Exam countdown → fetched from backend

## Exam countdown API

The frontend expects:

GET http://localhost:8000/api/exam

Response:

{
  "exam_date": "YYYY-MM-DD"
}

Keep the real exam date in your backend/database rather than hardcoding it in React.

## Existing CSS

The component class names are intentionally compatible with the existing UI. Keep your current CSS and add styles only for new classes if needed:

- .exam-focus-card
- .focus-grid

## Important next step

For a production version, move dashboard numbers such as syllabus percentage, PYQs solved, study hours, streak and AI recommendations to the backend/database as well. Then every value becomes user-specific instead of demo data.
