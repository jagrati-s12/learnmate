from pydantic import BaseModel


class ChapterBase(BaseModel):
    name: str
    subject_id: int
    order: int = 0


class ChapterCreate(ChapterBase):
    pass


class ChapterResponse(ChapterBase):
    id: int

    model_config = {"from_attributes": True}


class ChapterWithTopicsResponse(ChapterResponse):
    topics: list["TopicResponse"] = []


from app.schemas.topic import TopicResponse  # noqa: E402, F401

ChapterWithTopicsResponse.model_rebuild()
