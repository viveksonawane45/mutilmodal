from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant|system)$")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    answer: str
    actions: list[str]
    confidence: float


class PredictionRequest(BaseModel):
    disaster_type: str
    location: str
    parameters: dict[str, float | str] = Field(default_factory=dict)


class PredictionResponse(BaseModel):
    disaster_type: str
    location: str
    risk_score: float
    impact_radius_km: float
    summary: str
    recommended_actions: list[str]
