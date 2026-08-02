import requests

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