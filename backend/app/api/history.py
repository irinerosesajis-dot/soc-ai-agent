from fastapi import APIRouter, HTTPException, status
from typing import List
from app.database.database import (
    get_all_investigations,
    get_investigation_by_id,
    delete_investigation
)

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=List[dict])
@router.get("/", response_model=List[dict])
def get_history():
    """Retrieve all saved investigations (newest first)."""
    return get_all_investigations()


@router.get("/{record_id}", response_model=dict)
def get_history_by_id(record_id: str):
    """Retrieve a single investigation by ID."""
    record = get_investigation_by_id(record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation record with ID '{record_id}' not found."
        )
    return record


@router.delete("/{record_id}")
def delete_history_by_id(record_id: str):
    """Delete an investigation by ID."""
    success = delete_investigation(record_id)
    return {
        "status": "success",
        "message": f"Investigation record '{record_id}' deleted successfully.",
        "id": record_id
    }
