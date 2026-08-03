import requests
import base64
from app.config import VIRUSTOTAL_API_KEY

BASE_URL = "https://www.virustotal.com/api/v3"


def lookup_ip(ip: str):
    url = f"{BASE_URL}/ip_addresses/{ip}"
    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()

    return {
        "error": response.status_code,
        "message": response.text
    }


def lookup_domain(domain: str):
    url = f"{BASE_URL}/domains/{domain}"
    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()

    return {
        "error": response.status_code,
        "message": response.text
    }


def lookup_file(file_hash: str):
    """Query VirusTotal v3 files endpoint for a file hash (MD5/SHA1/SHA256)."""
    url = f"{BASE_URL}/files/{file_hash}"
    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()

    return {
        "error": response.status_code,
        "message": response.text
    }


def lookup_url(url_str: str):
    """Query VirusTotal v3 urls endpoint using base64 encoded URL identifier."""
    url_id = base64.urlsafe_b64encode(url_str.encode()).decode().strip("=")
    endpoint = f"{BASE_URL}/urls/{url_id}"
    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }
    response = requests.get(endpoint, headers=headers)
    if response.status_code == 200:
        return response.json()

    return {
        "error": response.status_code,
        "message": response.text
    }