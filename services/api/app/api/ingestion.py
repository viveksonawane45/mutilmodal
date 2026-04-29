from fastapi import APIRouter, Depends

from app.core.rbac import require_permission
from app.services.ingestion_service import ingestion_service

router = APIRouter(prefix="/ingestion", tags=["ingestion"])


@router.post("/signals")
async def ingest_signal(payload: dict, _: dict = Depends(require_permission("manage:response"))) -> dict:
    signal = ingestion_service.normalize_sensor_payload(payload)
    return {
        "status": "accepted",
        "signal": {
            "source_type": signal.source_type,
            "metric_name": signal.metric_name,
            "metric_value": signal.metric_value,
            "unit": signal.unit,
            "quality_score": signal.quality_score,
            "received_at": signal.received_at.isoformat()
        }
    }
