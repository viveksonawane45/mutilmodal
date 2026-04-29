from fastapi import APIRouter, Depends

from app.core.rbac import require_permission
from app.schemas.analytics import DashboardResponse
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=DashboardResponse)
async def dashboard(_: dict = Depends(require_permission("read:analytics"))) -> DashboardResponse:
    return analytics_service.dashboard()


@router.get("/modules/{disaster_type}")
async def disaster_module(disaster_type: str, _: dict = Depends(require_permission("read:analytics"))) -> dict:
    modules = {
        "earthquake": ["Magnitude detection", "Impact radius mapping", "Aftershock monitoring", "Rescue coordination"],
        "flood": ["Water level monitoring", "Evacuation planning", "Shelter allocation", "Drainage risk scoring"],
        "wildfire": ["Fire spread prediction", "Air quality monitoring", "Hotspot satellite overlays", "Crew safety routing"],
        "hurricane": ["Storm tracking", "Pre-impact resource staging", "Post-impact analysis", "Surge risk zones"]
    }
    return {"disaster_type": disaster_type, "capabilities": modules.get(disaster_type, [])}
