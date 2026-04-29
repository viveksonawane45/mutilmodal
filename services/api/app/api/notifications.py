from fastapi import APIRouter, Depends

from app.core.rbac import require_permission

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
async def notifications(_: dict = Depends(require_permission("read:analytics"))) -> list[dict]:
    return [
        {"id": "n-1", "severity": "critical", "title": "Flood risk increased", "body": "Pune sector C exceeded water-level acceleration threshold."},
        {"id": "n-2", "severity": "watch", "title": "Sensor drift detected", "body": "Two gauges require satellite validation."},
        {"id": "n-3", "severity": "info", "title": "Report draft ready", "body": "AI generated a quality-gated situation brief."}
    ]
