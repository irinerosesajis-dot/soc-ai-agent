from pprint import pprint

from app.services.virustotal_service import lookup_domain

result = lookup_domain("google.com")

pprint(result)