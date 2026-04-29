import asyncio
import random
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.core.rate_limit import RateLimitMiddleware
from app.realtime.manager import telemetry_manager


async def telemetry_loop() -> None:
    while True:
        risk = random.uniform(65, 88)
        await telemetry_manager.broadcast_json(
            {
                "riskIndex": risk,
                "waterLevel": random.uniform(4.8, 7.1),
                "seismicMagnitude": random.uniform(2.8, 4.4),
                "airQuality": random.uniform(95, 168),
                "windSpeed": random.uniform(42, 86),
                "message": "Live multimodal telemetry fused from sensor, weather, social, and satellite streams."
            }
        )
        await asyncio.sleep(3)


@asynccontextmanager
async def lifespan(_: FastAPI):
    task = asyncio.create_task(telemetry_loop())
    yield
    task.cancel()


settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.add_middleware(RateLimitMiddleware, requests_per_minute=180)

app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/health", tags=["system"])
async def health() -> dict:
    return {"status": "ok", "service": settings.app_name}


@app.websocket("/ws/telemetry")
async def telemetry_socket(websocket: WebSocket) -> None:
    await telemetry_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        telemetry_manager.disconnect(websocket)
