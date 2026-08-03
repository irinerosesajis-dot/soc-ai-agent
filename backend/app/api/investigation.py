import logging
from fastapi import APIRouter
from app.services.virustotal_service import (
    lookup_ip, 
    lookup_domain, 
    lookup_file, 
    lookup_url
)
from app.services.abuseipdb_service import check_ip
from app.services.gemini_service import generate_investigation_summary
from app.database.database import save_investigation

from app.models.investigation import (
    InvestigationRequest,
    InvestigationResponse,
)

from app.utils.ioc_detector import detect_ioc_type

logger = logging.getLogger(__name__)
router = APIRouter()


def calculate_risk_level(malicious_count: int) -> str:
    if malicious_count == 0:
        return "Low"
    elif 1 <= malicious_count <= 4:
        return "Medium"
    elif 5 <= malicious_count <= 15:
        return "High"
    else:
        return "Critical"


def extract_virustotal_summary(vt_raw: dict) -> dict:
    if not vt_raw or not isinstance(vt_raw, dict) or "data" not in vt_raw:
        return None
    attributes = vt_raw.get("data", {}).get("attributes", {})
    stats = attributes.get("last_analysis_stats", {})
    return {
        "malicious": stats.get("malicious", 0),
        "suspicious": stats.get("suspicious", 0),
        "harmless": stats.get("harmless", 0),
        "undetected": stats.get("undetected", 0),
        "reputation": attributes.get("reputation", 0)
    }


@router.post("/investigate", response_model=InvestigationResponse)
def investigate(request: InvestigationRequest):
    ioc_type = detect_ioc_type(request.ioc)
    vt_raw = None
    abuseipdb_result = None

    if ioc_type == "IP Address":
        vt_raw = lookup_ip(request.ioc)
        abuseipdb_result = check_ip(request.ioc)
    elif ioc_type == "Domain":
        vt_raw = lookup_domain(request.ioc)
    elif ioc_type in ("File Hash", "MD5 Hash", "SHA1 Hash", "SHA256 Hash") or "Hash" in ioc_type:
        vt_raw = lookup_file(request.ioc)
    elif ioc_type == "URL":
        vt_raw = lookup_url(request.ioc)


    vt_summary = extract_virustotal_summary(vt_raw)
    malicious_count = vt_summary.get("malicious", 0) if vt_summary else 0
    risk_level = calculate_risk_level(malicious_count)

    logger.info(f"[DEBUG] IOC: {request.ioc} | IOC Type: {ioc_type}")
    logger.info(f"[DEBUG] VirusTotal Summary: {vt_summary}")
    logger.info(f"[DEBUG] Malicious Detections: {malicious_count} | Risk Level: {risk_level}")


    investigation_data = {
        "ioc": request.ioc,
        "ioc_type": ioc_type,
        "risk_level": risk_level,
        "virustotal": vt_summary,
        "abuseipdb": abuseipdb_result,
    }

    logger.info(f"Starting AI summary generation for IOC: {request.ioc}")
    ai_summary = generate_investigation_summary(investigation_data)

    if not ai_summary:
        ai_summary = "AI investigation summary is currently unavailable."

    logger.info(f"Gemini response: {ai_summary[:100]}...")
    logger.info(f"ai_summary value before database save: {ai_summary[:100]}...")

    record_to_save = {
        "ioc": request.ioc,
        "ioc_type": ioc_type,
        "risk_level": risk_level,
        "virustotal": vt_summary,
        "abuseipdb": abuseipdb_result,
        "ai_summary": ai_summary,
        "summary": ai_summary
    }
    saved_doc = save_investigation(record_to_save)

    logger.info(f"Final response ai_summary: {ai_summary[:100]}...")

    return InvestigationResponse(
        id=saved_doc.get("id"),
        ioc=request.ioc,
        ioc_type=ioc_type,
        risk_level=risk_level,
        virustotal=vt_summary,
        abuseipdb=abuseipdb_result,
        ai_summary=ai_summary
    )