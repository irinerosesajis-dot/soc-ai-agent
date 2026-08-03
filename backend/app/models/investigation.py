from pydantic import BaseModel
from typing import Optional, Dict, Any


class InvestigationRequest(BaseModel):
    ioc: str


class InvestigationResponse(BaseModel):
    id: Optional[str] = None
    ioc: str
    ioc_type: str
    risk_level: str
    virustotal: Optional[Dict[str, Any]] = None
    abuseipdb: Optional[Dict[str, Any]] = None
    ai_summary: Optional[str] = None
    date: Optional[str] = None