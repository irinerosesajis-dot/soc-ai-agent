import re
from urllib.parse import urlparse

def detect_ioc_type(ioc: str) -> str:
    """
    Detect the type of IOC (Indicator of Compromise).
    """

    ioc = ioc.strip()

    # IPv4 Address
    ip_pattern = r"^(?:\d{1,3}\.){3}\d{1,3}$"
    if re.match(ip_pattern, ioc):
        return "IP Address"

    # URL
    parsed = urlparse(ioc)
    if parsed.scheme in ("http", "https") and parsed.netloc:
        return "URL"

    # Domain
    domain_pattern = r"^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$"
    if re.match(domain_pattern, ioc):
        return "Domain"

    # MD5
    if re.fullmatch(r"[A-Fa-f0-9]{32}", ioc):
        return "MD5 Hash"

    # SHA1
    if re.fullmatch(r"[A-Fa-f0-9]{40}", ioc):
        return "SHA1 Hash"

    # SHA256
    if re.fullmatch(r"[A-Fa-f0-9]{64}", ioc):
        return "SHA256 Hash"

    return "Unknown"