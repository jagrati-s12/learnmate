from pydantic import BaseModel


class QuestionBase(BaseModel):
    topic_id: int
    text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str  # 'a', 'b', 'c', 'd'
    difficulty: str = "medium"
    explanation: str | None = None


class QuestionCreate(QuestionBase):
    pass


class QuestionResponse(QuestionBase):
    id: int

    model_config = {"from_attributes": True}


class QuestionPublicResponse(BaseModel):
    """Response without the correct answer — used during practice / tests."""
    id: int
    topic_id: int
    text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    difficulty: str

    model_config = {"from_attributes": True}
