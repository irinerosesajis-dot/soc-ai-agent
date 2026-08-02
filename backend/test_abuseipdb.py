from pprint import pprint
from app.services.abuseipdb_service import check_ip

result = check_ip("8.8.8.8")
pprint(result)
