"""Health check router — no authentication required."""
from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/health", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "service": "legal-ai-service",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
