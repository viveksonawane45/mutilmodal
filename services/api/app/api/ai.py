from fastapi import APIRouter, Depends

from app.core.rbac import require_permission
from app.schemas.ai import ChatRequest, ChatResponse, PredictionRequest, PredictionResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, _: dict = Depends(require_permission("chat:ai"))) -> ChatResponse:
    answer, actions, confidence = await ai_service.chat(request.messages)
    return ChatResponse(answer=answer, actions=actions, confidence=confidence)


@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest, _: dict = Depends(require_permission("read:analytics"))) -> PredictionResponse:
    return await ai_service.predict(request)
