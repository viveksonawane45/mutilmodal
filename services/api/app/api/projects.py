from fastapi import APIRouter, Depends

from app.core.rbac import require_permission

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("")
async def list_projects(_: dict = Depends(require_permission("read:projects"))) -> list[dict]:
    return [
        {
            "id": "flood-resilience",
            "name": "Regional Flood Resilience Study",
            "status": "active",
            "team": ["Hydrologist", "GIS analyst", "Emergency coordinator"],
            "timeline": {"start": "2026-04-01", "end": "2026-07-15"}
        },
        {
            "id": "seismic-cluster",
            "name": "Bay Seismic Cluster Assessment",
            "status": "monitoring",
            "team": ["Seismologist", "ML engineer", "Field supervisor"],
            "timeline": {"start": "2026-03-10", "end": "2026-06-30"}
        }
    ]
