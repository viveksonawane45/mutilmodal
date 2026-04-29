from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass(frozen=True)
class NormalizedSignal:
    source_type: str
    metric_name: str
    metric_value: float
    unit: str
    quality_score: float
    received_at: datetime


class IngestionService:
    def normalize_sensor_payload(self, payload: dict) -> NormalizedSignal:
        return NormalizedSignal(
            source_type=str(payload.get("source_type", "iot")),
            metric_name=str(payload.get("metric_name", "risk_index")),
            metric_value=float(payload.get("metric_value", 0)),
            unit=str(payload.get("unit", "score")),
            quality_score=float(payload.get("quality_score", 0.8)),
            received_at=datetime.now(timezone.utc)
        )


ingestion_service = IngestionService()
