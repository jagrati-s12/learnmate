# LearnMate AI - Architecture

## System Overview

LearnMate AI is a competitive exam preparation platform for SSC JE Civil Engineering.

## Architecture Diagram

```
┌─────────────┐
│   Frontend  │  React + TypeScript + Vite + Tailwind
│  (Port 5173)│
└──────┬──────┘
       │ HTTP/REST
       ↓
┌─────────────┐
│   Backend   │  FastAPI + Python
│  (Port 8000)│
└──────┬──────┘
       │ SQL
       ↓
┌─────────────┐
│  Database   │  PostgreSQL
│ (Port 5432) │
└─────────────┘
```

## Core Components

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State**: React hooks (Context API for global state if needed)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **ORM**: SQLAlchemy (to be configured in Phase 2)
- **Authentication**: JWT tokens
- **Validation**: Pydantic

### Database
- **RDBMS**: PostgreSQL
- **Schema**: Relational design following the hierarchy:
  - Exam → Branch → Subject → Chapter → Topic → Question

## Data Model Hierarchy

```
Exam (e.g., SSC JE)
└── Branch (e.g., Civil Engineering)
    └── Subject (e.g., Structural Engineering)
        └── Chapter (e.g., RCC Design)
            └── Topic (e.g., Beam Design)
                └── Question
```

This hierarchical structure ensures:
- **Scalability**: Easy to add new exams, branches, subjects
- **Flexibility**: Support for multiple exam types
- **Data Integrity**: Clear relationships and constraints
- **Query Efficiency**: Optimized filtering and navigation

## Key Features Architecture

### 1. Authentication Flow
```
User → Login/Register → JWT Token → Protected Routes
```

### 2. Practice System
```
Select Topic → Load Questions → Answer → Submit → Store Attempt → Show Result
```

### 3. Mock Test System
```
Start Test → Timer → Answer Questions → Submit → Calculate Score → Show Results
```

### 4. Progress Tracking
```
Store Attempts → Calculate Metrics → Generate Analytics → Display Progress
```

## API Design

All API endpoints will follow RESTful conventions:
- `GET /api/v1/questions` - List questions
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/tests` - Create test attempt
- `GET /api/v1/progress` - Get user progress

## Security Considerations

1. **Authentication**: JWT-based stateless authentication
2. **Authorization**: Role-based access (Student, Admin)
3. **Input Validation**: Pydantic schemas for all inputs
4. **SQL Injection Prevention**: SQLAlchemy ORM with parameterized queries
5. **CORS**: Configured for frontend origin only
6. **Environment Variables**: Sensitive data in `.env` files

## Deployment Strategy (Future)

```
Frontend → Static hosting (Vercel/Netlify)
Backend → Cloud platform (to be decided)
Database → Managed PostgreSQL
```

## Development Phases

**Phase 0**: ✅ Project initialization
**Phase 1**: Frontend interface with mock data
**Phase 2**: Database design and implementation
**Phase 3**: Backend API development
**Phase 4**: Question data pipeline
**Phase 5**: Practice system integration
**Phase 6**: Mock test engine
**Phase 7**: Results and analytics
**Phase 8**: Admin panel
**Phase 9**: QA and deployment preparation
**Future**: AI integration using Gemini API
