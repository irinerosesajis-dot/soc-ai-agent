import requests
from app.config import ABUSEIPDB_API_KEY

BASE_URL = "https://api.abuseipdb.com/api/v2"


def check_ip(ip: str):
    url = f"{BASE_URL}/check"

    headers = {
        "Accept": "application/json",
        "Key": ABUSEIPDB_API_KEY
    }

    params = {
        "ipAddress": ip,
        "maxAgeInDays": "90"
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        print(response.json())

        if response.status_code == 200:
            data = response.json().get("data", {})
            return {
                "abuseConfidenceScore": data.get("abuseConfidenceScore"),
                "countryCode": data.get("countryCode"),
                "isp": data.get("isp"),
                "usageType": data.get("usageType"),
                "totalReports": data.get("totalReports"),
                "lastReportedAt": data.get("lastReportedAt")
            }

        return {
            "error": response.status_code,
            "message": response.text
        }
    except Exception as e:
        return {
            "error": "request_failed",
            "message": str(e)
        }
