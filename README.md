# LearnMate AI

An AI-powered learning platform for competitive exam preparation.

**Current Focus**: SSC JE – Civil Engineering

## Project Structure

```
learnmate/
├── frontend/          # React + Vite + TypeScript + Tailwind CSS
├── backend/           # FastAPI + Python
├── docs/              # Documentation
└── README.md
```

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Python
- FastAPI

### Database
- PostgreSQL

### Version Control
- Git + GitHub

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend will run on http://localhost:8000

## Development Status

**Phase 0**: Project Initialization - In Progress

## Core Features (Planned)

- Authentication (Register, Login, Logout)
- Student Dashboard
- Topic-wise Question Practice
- PYQ (Previous Year Questions) Explorer
- Mock Test System
- Results & Analytics
- Progress Tracking
- Bookmarks
- Admin Panel

## Architecture

The platform follows a scalable hierarchy:

```
Exam
└── Branch
    └── Subject
        └── Chapter
            └── Topic
                └── Question
```

Initial implementation focuses on SSC JE → Civil Engineering, but the architecture supports future expansion to other branches and exams.

## License

Proprietary
