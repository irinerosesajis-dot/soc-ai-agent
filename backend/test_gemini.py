# from google import genai
# from app.config import GEMINI_API_KEY

# client = genai.Client(api_key=GEMINI_API_KEY)

# response = client.models.generate_content(
#     model="gemini-3.5-flash",
#     contents="Say hello in one sentence."
# )

# print(response.text)
from app.services.gemini_service import generate_investigation_summary

sample = {
    "ioc": "8.8.8.8",
    "ioc_type": "IP Address",
    "risk_level": "Low",
    "virustotal": {
        "malicious": 0,
        "suspicious": 0
    },
    "abuseipdb": {
        "abuseConfidenceScore": 0
    }
}

print("=== GEMINI GENERATED SUMMARY ===")
print(generate_investigation_summary(sample))