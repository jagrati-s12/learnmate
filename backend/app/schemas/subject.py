from pydantic import BaseModel


class SubjectBase(BaseModel):
    name: str
    description: str | None = None
    icon_url: str | None = None


class SubjectCreate(SubjectBase):
    pass


class SubjectResponse(SubjectBase):
    id: int

    model_config = {"from_attributes": True}


class SubjectWithChaptersResponse(SubjectResponse):
    chapters: list["ChapterResponse"] = []


# Avoid circular import — import at bottom
from app.schemas.chapter import ChapterResponse  # noqa: E402, F401

SubjectWithChaptersResponse.model_rebuild()
