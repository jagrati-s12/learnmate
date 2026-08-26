# LearnMate Backend — Setup Guide

## Prerequisites

- Python 3.11+
- PostgreSQL running locally (or a remote instance)

## Quick Start

### 1. Create and activate a virtual environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
copy .env.example .env
```

Edit `.env` and set your actual PostgreSQL connection string and a secure secret key:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/learnmate
SECRET_KEY=your-random-secret-key-here
```

### 4. Create the database

Make sure a PostgreSQL database named `learnmate` exists:

```sql
CREATE DATABASE learnmate;
```

### 5. Run the server

```bash
uvicorn app.main:app --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Route Overview

| Prefix | Routes |
|---|---|
| `/api/auth` | `/register`, `/login`, `/logout`, `/profile` |
| `/api` | `/questions`, `/questions/{id}`, `/subjects`, `/chapters`, `/topics` |
| `/api` | `/practice`, `/attempts` |
| `/api` | `/tests`, `/tests/{id}`, `/tests/{id}/submit` |
| `/api` | `/results`, `/results/{id}`, `/progress` |

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI app entry point
│   ├── config.py        # Settings (.env)
│   ├── database.py      # SQLAlchemy setup
│   ├── dependencies.py  # get_db, get_current_user
│   ├── models/          # ORM models
│   ├── schemas/         # Pydantic schemas
│   ├── routes/          # API route files
│   └── utils/           # Security, admin helpers
├── requirements.txt
├── .env.example
└── README.md
```
