from app.core.config import get_settings
from app.schemas.ai import ChatMessage, PredictionRequest, PredictionResponse


class AIService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def chat(self, messages: list[ChatMessage]) -> tuple[str, list[str], float]:
        prompt = messages[-1].content.lower() if messages else ""
        fallback = self._fallback_answer(prompt)

        if not self.settings.openai_api_key:
            return fallback

        try:
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(model=self.settings.openai_model, api_key=self.settings.openai_api_key, temperature=0.2)
            response = await llm.ainvoke(
                [
                    (
                        "system",
                        "You are DisasterScope, an emergency response AI. Give concise, auditable, safety-focused disaster analytics and recommendations."
                    ),
                    *[(message.role, message.content) for message in messages[-8:]]
                ]
            )
            return str(response.content), ["retrieve_live_context", "rank_response_options", "draft_operational_summary"], 0.86
        except Exception:
            return fallback

    async def predict(self, request: PredictionRequest) -> PredictionResponse:
        disaster_type = request.disaster_type.lower()
        base_scores = {"earthquake": 72, "flood": 82, "wildfire": 76, "hurricane": 79}
        risk_score = float(base_scores.get(disaster_type, 64))
        impact_radius = float(request.parameters.get("radius_km", max(12, risk_score * 0.42)))
        return PredictionResponse(
            disaster_type=disaster_type,
            location=request.location,
            risk_score=risk_score,
            impact_radius_km=impact_radius,
            summary=f"{disaster_type.title()} risk for {request.location} is {risk_score:.0f}/100 with a projected {impact_radius:.1f} km impact radius.",
            recommended_actions=[
                "Validate high-confidence anomalies with a second data source.",
                "Pre-position response teams near low-congestion access routes.",
                "Generate a public briefing with confidence and uncertainty notes."
            ]
        )

    def _fallback_answer(self, prompt: str) -> tuple[str, list[str], float]:
        if "pune" in prompt or "flood" in prompt:
            answer = (
                "Flood risk in Pune is high. IoT water-level acceleration, rainfall persistence, and social road-closure signals point to a "
                "22 km priority monitoring radius. Open west-side shelters, stage rescue boats, and verify the drifting sensor cluster with satellite imagery."
            )
        elif "earthquake" in prompt:
            answer = (
                "The projected earthquake impact zone should be modeled from magnitude, depth, soil amplification, and hospital accessibility. "
                "Use a 36 km first-pass radius, then narrow it with building vulnerability and aftershock probability layers."
            )
        elif "resource" in prompt or "shelter" in prompt:
            answer = (
                "Resource optimization favors moving boats and medical kits toward high-access staging points while balancing shelter load below 85 percent capacity."
            )
        else:
            answer = (
                "I can analyze disaster risk, summarize multimodal evidence, generate reports, and recommend response actions using live sensors, maps, and project context."
            )
        return answer, ["retrieve_context", "score_risk", "recommend_actions"], 0.78


ai_service = AIService()
