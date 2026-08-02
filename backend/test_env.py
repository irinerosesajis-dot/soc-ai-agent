from app.config import (
    VIRUSTOTAL_API_KEY,
    ABUSEIPDB_API_KEY,
    GEMINI_API_KEY,
)

print("VirusTotal:", bool(VIRUSTOTAL_API_KEY))
print("AbuseIPDB:", bool(ABUSEIPDB_API_KEY))
print("Gemini:", bool(GEMINI_API_KEY))