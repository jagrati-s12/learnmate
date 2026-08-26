from pydantic import BaseModel


class TopicBase(BaseModel):
    name: str
    chapter_id: int
    content: str | None = None
    order: int = 0


class TopicCreate(TopicBase):
    pass


class TopicResponse(TopicBase):
    id: int

    model_config = {"from_attributes": True}
