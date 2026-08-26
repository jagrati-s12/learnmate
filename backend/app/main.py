from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base

# Import all models so Base.metadata knows about every table
import app.models  # noqa: F401

# Import routers
from app.routes.auth import router as auth_router
from app.routes.questions import router as questions_router
from app.routes.practice import router as practice_router
from app.routes.tests import router as tests_router
from app.routes.results import router as results_router


# ---------------------------------------------------------------------------
# Lifespan — create tables on startup (dev convenience)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: nothing to clean up


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="LearnMate API",
    description="Backend API for the LearnMate AI-powered learning platform.",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow the Vite frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev
        "http://localhost:3000",  # alternate dev port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth_router)
app.include_router(questions_router)
app.include_router(practice_router)
app.include_router(tests_router)
app.include_router(results_router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "LearnMate API is running 🚀"}
