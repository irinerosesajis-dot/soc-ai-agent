import logging
from google import genai
from app.config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize Gemini Client: {e}")
        client = None
else:
    client = None


def generate_local_fallback_summary(investigation_data: dict) -> str:
    """
    Generates a structured SOC Analyst summary locally when Gemini API is rate-limited or offline.
    Ensures OVERALL ASSESSMENT, THREAT RATIONALE, and RECOMMENDED NEXT ACTIONS are always present.
    """
    ioc = investigation_data.get("ioc") or investigation_data.get("IOC", "Unknown")
    ioc_type = investigation_data.get("ioc_type") or investigation_data.get("IOC Type", "Unknown")
    risk_level = investigation_data.get("risk_level") or investigation_data.get("Risk Level", "Low")
    vt = investigation_data.get("virustotal")
    abuse = investigation_data.get("abuseipdb")

    vt_str = f"Malicious: {vt.get('malicious', 0)}, Suspicious: {vt.get('suspicious', 0)}, Harmless: {vt.get('harmless', 0)}" if vt else "No VirusTotal detections recorded."
    abuse_str = f"Abuse Confidence Score: {abuse.get('abuseConfidenceScore', 0)}%, Reports: {abuse.get('totalReports', 0)}" if abuse else "AbuseIPDB report not applicable for this IOC type."

    if risk_level.lower() in ["high", "critical"]:
        assessment = f"The target IOC {ioc} ({ioc_type}) presents an elevated threat posture evaluated at {risk_level.upper()} Risk level. Active malicious indicators have been confirmed across threat intelligence feeds."
        rationale = f"VirusTotal analysis: {vt_str}. AbuseIPDB analysis: {abuse_str}. Security engines confirm active threat telemetry."
        actions = f"1. Immediately block communication to {ioc} across edge firewalls and proxy gateways.\n2. Isolate any internal hosts observed communicating with this indicator.\n3. Conduct retrospective SIEM log searches for historical access to {ioc}."
    elif risk_level.lower() == "medium":
        assessment = f"The target IOC {ioc} ({ioc_type}) has been evaluated at MEDIUM Risk level. Suspicious activity or low-level threat detections have been observed."
        rationale = f"VirusTotal findings: {vt_str}. AbuseIPDB findings: {abuse_str}. Evidence suggests suspicious or unverified reputation."
        actions = f"1. Place {ioc} on watchlists for enhanced SIEM logging and alert monitoring.\n2. Verify internal network traffic logs for unexpected outbound connections.\n3. Re-evaluate indicator reputation in 24 hours."
    else:
        assessment = f"The target IOC {ioc} ({ioc_type}) is currently evaluated at LOW Risk level. No malicious indicators were detected across threat feeds."
        rationale = f"VirusTotal analysis: {vt_str}. AbuseIPDB analysis: {abuse_str}. Threat engines report clean/harmless status."
        actions = f"1. No immediate isolation required for {ioc}.\n2. Maintain standard SOC logging and threat monitoring.\n3. Conduct routine periodic threat intelligence updates."

    return f"""OVERALL ASSESSMENT:
{assessment}

THREAT RATIONALE:
{rationale}

RECOMMENDED NEXT ACTIONS:
{actions}"""


def generate_investigation_summary(investigation_data: dict) -> str:
    """
    Generates a professional SOC analyst investigation summary using Gemini API.
    Falls back to structured rule-based summary if API is rate-limited (429) or offline.
    """
    logger.info("Starting AI summary generation")

    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY missing. Returning structured local fallback summary.")
        return generate_local_fallback_summary(investigation_data)

    ioc = investigation_data.get("ioc") or investigation_data.get("IOC", "Unknown")
    ioc_type = investigation_data.get("ioc_type") or investigation_data.get("IOC Type", "Unknown")
    risk_level = investigation_data.get("risk_level") or investigation_data.get("Risk Level", "Unknown")
    vt = investigation_data.get("virustotal") or investigation_data.get("VirusTotal summary")
    abuse = investigation_data.get("abuseipdb") or investigation_data.get("AbuseIPDB summary")

    prompt = f"""
You are a senior Tier 3 SOC Analyst conducting an automated threat intelligence investigation.
Analyze the following Indicator of Compromise (IOC) payload and generate a concise, professional summary in plain text.

TARGET DATA:
- Indicator of Compromise (IOC): {ioc}
- IOC Type: {ioc_type}
- Risk Level: {risk_level}

THREAT FEEDS:
- VirusTotal Summary: {vt if vt else "Not available"}
- AbuseIPDB Summary: {abuse if abuse else "Not applicable or not available"}

REQUIRED SECTIONS IN YOUR SUMMARY:
OVERALL ASSESSMENT: High-level summary of the threat posture.
THREAT RATIONALE: Explanation of why this IOC is considered risky or benign based on VirusTotal and AbuseIPDB data.
RECOMMENDED NEXT ACTIONS: Actionable next steps for security operations (e.g. blocking, endpoint isolation, monitoring).

REQUIREMENTS:
- Return ONLY plain text without any markdown or formatting decorations if possible.
- Include the exact section headings OVERALL ASSESSMENT:, THREAT RATIONALE:, and RECOMMENDED NEXT ACTIONS:.
- Sound authoritative, objective, professional, and directly actionable.
"""

    models_to_try = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"]
    active_client = client or genai.Client(api_key=GEMINI_API_KEY)


    for model_name in models_to_try:
        try:
            logger.info(f"Attempting Gemini generation with model: {model_name}")
            response = active_client.models.generate_content(
                model=model_name,
                contents=prompt,
            )

            if response and response.text and response.text.strip():
                summary_text = response.text.strip()
                logger.info(f"Gemini response successfully generated using {model_name}")
                print(f"Gemini response:\n{summary_text}")
                return summary_text

        except Exception as e:
            logger.warning(f"Gemini generation error with model {model_name}: {e}")

    logger.warning("All Gemini API models failed or rate-limited. Using structured local fallback summary.")
    fallback = generate_local_fallback_summary(investigation_data)
    print(f"Gemini response (local fallback):\n{fallback}")
    return fallback
