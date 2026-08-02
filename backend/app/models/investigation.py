from pydantic import BaseModel
from typing import Optional, Dict, Any


class InvestigationRequest(BaseModel):
    ioc: str


class InvestigationResponse(BaseModel):
    ioc: str
    ioc_type: str
    threat_intelligence: Optional[Dict[str, Any]] = None