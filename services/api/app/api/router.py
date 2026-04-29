from fastapi import APIRouter

from app.api import ai, analytics, auth, ingestion, notifications, projects

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(analytics.router)
api_router.include_router(ai.router)
api_router.include_router(projects.router)
api_router.include_router(notifications.router)
api_router.include_router(ingestion.router)
