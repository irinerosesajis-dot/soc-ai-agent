from pprint import pprint
from app.models.investigation import InvestigationRequest
from app.api.investigation import investigate

res_ip = investigate(InvestigationRequest(ioc="8.8.8.8"))
print("--- IP ADDRESS RESPONSE ---")
pprint(res_ip.model_dump())

res_domain = investigate(InvestigationRequest(ioc="google.com"))
print("\n--- DOMAIN RESPONSE ---")
pprint(res_domain.model_dump())
