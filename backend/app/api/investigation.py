from fastapi import APIRouter
from app.services.virustotal_service import lookup_ip, lookup_domain
from app.services.abuseipdb_service import check_ip

from app.models.investigation import (
    InvestigationRequest,
    InvestigationResponse,
)

from app.utils.ioc_detector import detect_ioc_type

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

    vt_summary = extract_virustotal_summary(vt_raw)
    malicious_count = vt_summary.get("malicious", 0) if vt_summary else 0
    risk_level = calculate_risk_level(malicious_count)

    return InvestigationResponse(
        ioc=request.ioc,
        ioc_type=ioc_type,
        risk_level=risk_level,
        virustotal=vt_summary,
        abuseipdb=abuseipdb_result
    )