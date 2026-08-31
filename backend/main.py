from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="LearnMate AI API",
    description="API for SSC JE Civil Engineering preparation platform",
    version="0.1.0",
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "LearnMate AI API",
        "version": "0.1.0",
        "status": "active"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# API routes will be added in subsequent phases
# from app.api.v1 import auth, questions, tests, progress

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
