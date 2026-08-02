from fastapi import APIRouter
from app.services.virustotal_service import lookup_ip, lookup_domain

from app.models.investigation import (
    InvestigationRequest,
    InvestigationResponse,
)

from app.utils.ioc_detector import detect_ioc_type

router = APIRouter()


@router.post("/investigate", response_model=InvestigationResponse)
def investigate(request: InvestigationRequest):

    ioc_type = detect_ioc_type(request.ioc)
    vt_result = None

    if ioc_type == "IP Address":
        vt_result = lookup_ip(request.ioc)

    elif ioc_type == "Domain":
        vt_result = lookup_domain(request.ioc)

    # return InvestigationResponse(
    #     ioc=request.ioc,
    #     ioc_type=ioc_type
    # )
    return InvestigationResponse(
    ioc=request.ioc,
    ioc_type=ioc_type,
    threat_intelligence=vt_result)