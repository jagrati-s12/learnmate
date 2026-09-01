"""User-related Pydantic schemas"""
from pydantic import BaseModel, Field, field_validator
from email_validator import validate_email, EmailNotValidError
from typing import Optional
from datetime import datetime


def _validate_email_address(value: str) -> str:
    """
    Validate an email address using the `email-validator` package directly.
    Pydantic 2.13's `EmailStr` has a known incompatibility with
    `email-validator` 2.3.0 on Python 3.14, so we use the library's own
    callable and skip DNS deliverability checks (we only need syntax +
    normalized form for the database).
    """
    if not value or not isinstance(value, str):
        raise ValueError("Email is required")
    try:
        info = validate_email(value, check_deliverability=False)
    except EmailNotValidError as exc:
        raise ValueError(str(exc))
    return info.normalized


class UserCreate(BaseModel):
    """User registration schema"""
    email: str
    password: str = Field(..., min_length=6, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    address: Optional[str] = None

    @field_validator("email")
    @classmethod
    def _email_valid(cls, v: str) -> str:
        return _validate_email_address(v)


class UserLogin(BaseModel):
    """User login schema"""
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def _email_valid(cls, v: str) -> str:
        return _validate_email_address(v)


class UserUpdate(BaseModel):
    """User profile update schema"""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    address: Optional[str] = None


class UserResponse(BaseModel):
    """User response schema (public info)"""
    id: int
    email: str
    full_name: str
    roll_number: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
