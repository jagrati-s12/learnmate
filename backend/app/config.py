from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "LEARNMATE AI"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # Database (psycopg3 driver — use postgresql+psycopg:// to avoid psycopg2 lookup)
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/learnmate_db"
    DB_ECHO: bool = False

    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:5174"]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()
