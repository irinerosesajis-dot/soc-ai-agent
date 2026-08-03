from fastapi import APIRouter
from app.database.database import get_dashboard_stats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_stats():
    """
    Returns live SOC Dashboard statistics computed directly from the MongoDB investigations
    collection (or fallback in-memory store). Does NOT query VirusTotal, AbuseIPDB, or Gemini.
    """
    return get_dashboard_stats()
