from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token
from app.schemas.auth import TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

ALLOWED_ROLES = {"researcher", "emergency_manager", "admin"}


@router.get("/demo-token/{role}", response_model=TokenResponse)
async def demo_token(role: str) -> TokenResponse:
    if role not in ALLOWED_ROLES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported role")
    token = create_access_token(subject=f"demo-{role}@disasterscope.local", role=role, extra_claims={"name": f"Demo {role}"})
    return TokenResponse(access_token=token, role=role)
