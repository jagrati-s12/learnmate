# LearnMate AI Backend

FastAPI backend for LearnMate AI platform.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

5. Run the development server:
```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

API documentation: http://localhost:8000/docs

## Project Structure

```
backend/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── app/
    ├── api/               # API routes
    ├── core/              # Core functionality (config, security)
    ├── db/                # Database connection and session
    ├── models/            # SQLAlchemy models
    ├── schemas/           # Pydantic schemas
    └── services/          # Business logic
```

## Development

Phase 0: Project initialization
Phase 1: Frontend interface (planned)
Phase 2: Database design (planned)
Phase 3: Backend foundation (planned)
