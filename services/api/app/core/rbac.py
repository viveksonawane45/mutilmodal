from collections.abc import Callable

from fastapi import Depends, HTTPException, status

from app.core.security import current_user

ROLE_PERMISSIONS = {
    "researcher": {"read:projects", "read:analytics", "write:reports", "chat:ai"},
    "emergency_manager": {"read:projects", "read:analytics", "write:alerts", "manage:response", "chat:ai"},
    "admin": {"read:projects", "read:analytics", "write:reports", "write:alerts", "manage:response", "manage:users", "chat:ai"}
}


def require_permission(permission: str) -> Callable:
    def dependency(user: dict = Depends(current_user)) -> dict:
        role = user.get("role")
        if permission not in ROLE_PERMISSIONS.get(role, set()):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permission")
        return user

    return dependency
