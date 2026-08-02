from pydantic import BaseModel
from typing import Optional, Dict, Any


class InvestigationRequest(BaseModel):
    ioc: str


class InvestigationResponse(BaseModel):
    ioc: str
    ioc_type: str
    risk_level: str
    virustotal: Optional[Dict[str, Any]] = None
    abuseipdb: Optional[Dict[str, Any]] = None