from fastapi import APIRouter, HTTPException, status, Response
from app.database.database import get_investigation_by_id
from app.services.pdf_service import generate_pdf_report
import re

router = APIRouter(prefix="/report", tags=["report"])


@router.get("/pdf/{investigation_id}")
def download_pdf_report(investigation_id: str):
    """
    Retrieves the stored investigation from MongoDB by ID and returns a professionally
    formatted PDF Incident Report. Does NOT call VirusTotal, AbuseIPDB, or Gemini again.
    """
    record = get_investigation_by_id(investigation_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation record with ID '{investigation_id}' not found."
        )

    try:
        pdf_bytes = generate_pdf_report(record)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF incident report: {str(err)}"
        )

    # Sanitize IOC string for filename
    investigation = record.get("investigation") or record
    raw_ioc = investigation.get("ioc") or record.get("ioc", "IOC")
    safe_ioc = re.sub(r'[^a-zA-Z0-9._-]', '_', str(raw_ioc))
    filename = f"SOC_Incident_Report_{safe_ioc}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
