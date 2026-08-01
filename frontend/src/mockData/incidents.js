export const MOCK_IOC_INVESTIGATIONS = [
  {
    id: "INV-2026-001",
    iocType: "IP Address",
    iocValue: "198.51.100.44",
    riskLevel: "Critical",
    status: "Completed",
    date: "2026-08-01 19:30 UTC",
    threatIntel: {
      virusTotal: "48/92 Security Vendors Flagged Malicious",
      abuseIpdb: "94% Confidence Score (Reported 142 times for C2 activity)",
      reputation: "Known Command & Control (C2) botnet node"
    },
    aiReasoning: "The IP 198.51.100.44 is actively associated with Cobalt Strike Beacon C2 infrastructure. Network logs confirm outbound TLS connections on non-standard port 443 with anomalous JA3 fingerprint matching APT29 activity.",
    recommendedActions: [
      "Immediately block IP 198.51.100.44 on all edge firewalls & cloud security groups",
      "Isolate internal host (10.0.4.15) from corporate subnet",
      "Revoke active Kerberos session tokens for associated user account",
      "Perform full EDR memory scan on infected endpoint"
    ],
    incidentReport: `# Incident Report: INV-2026-001
**Target IOC:** 198.51.100.44 (IP Address)
**Risk Level:** CRITICAL (Score: 95/100)
**Detection Timestamp:** 2026-08-01 19:30:00 UTC

### Executive Summary
High-confidence identification of an active Command & Control (C2) IP address communicating with internal finance workstation. The host attempted 14 encrypted outbound handshakes in 3 minutes.

### Threat Intelligence Correlation
- **VirusTotal:** 48/92 Vendors (Malicious / C2)
- **AbuseIPDB:** 94% Abuse Confidence Rating
- **Geo Location:** Moscow, Russian Federation (AS12389)

### Recommended Containment Playbook
1. Block IP 198.51.100.44 on Perimeter Firewall
2. Isolate Endpoint FIN-WORKSTATION-09
3. Invalidate Active Auth Tokens`
  },
  {
    id: "INV-2026-002",
    iocType: "Domain",
    iocValue: "c2-exfil-node.ru",
    riskLevel: "High",
    status: "Completed",
    date: "2026-08-01 18:45 UTC",
    threatIntel: {
      virusTotal: "32/90 Security Vendors Flagged Malicious",
      abuseIpdb: "High Entropy Domain (Created 2 days ago)",
      reputation: "Dynamic DNS domain used for data exfiltration"
    },
    aiReasoning: "High query volume detected for TXT records pointing to subdomains under c2-exfil-node.ru. Base64 payload decoding indicates sensitive file directory metadata exfiltration.",
    recommendedActions: [
      "Sinkhole domain c2-exfil-node.ru on internal DNS resolvers",
      "Inspect DEV-BUILD-02 outbound connections",
      "Perform compromised credential audit on associated developer accounts"
    ],
    incidentReport: `# Incident Report: INV-2026-002
**Target IOC:** c2-exfil-node.ru (Domain)
**Risk Level:** HIGH (Score: 88/100)
**Detection Timestamp:** 2026-08-01 18:45:00 UTC

### Executive Summary
Abnormal DNS TXT record tunneling detected. Domain was registered 48 hours prior and shows signs of automated data staging.`
  },
  {
    id: "INV-2026-003",
    iocType: "File Hash",
    iocValue: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    riskLevel: "Critical",
    status: "Completed",
    date: "2026-08-01 17:15 UTC",
    threatIntel: {
      virusTotal: "64/92 Security Vendors Flagged Malicious",
      abuseIpdb: "Mimikatz LSASS Password Dump Binary",
      reputation: "Known credential harvester utility"
    },
    aiReasoning: "Executable payload hash matches signed Mimikatz binary utilized in LSASS memory extraction attacks. Originates from temporary directory %TEMP%\\svchost_update.exe.",
    recommendedActions: [
      "Quarantine binary %TEMP%\\svchost_update.exe via EDR",
      "Force password reset for CORP\\jsmith across Active Directory",
      "Audit LSASS handle creation logs across domain controllers"
    ],
    incidentReport: `# Incident Report: INV-2026-003
**Target IOC:** e3b0c442... (File Hash)
**Risk Level:** CRITICAL (Score: 98/100)
**Detection Timestamp:** 2026-08-01 17:15:00 UTC

### Executive Summary
Mimikatz credential dumper binary detected executing on domain joined workstation.`
  },
  {
    id: "INV-2026-004",
    iocType: "URL",
    iocValue: "http://phishing-update.login-security.net/auth/login.php",
    riskLevel: "Medium",
    status: "Completed",
    date: "2026-08-01 14:10 UTC",
    threatIntel: {
      virusTotal: "18/88 Security Vendors Flagged Phishing",
      abuseIpdb: "Spoofed Microsoft 365 Authentication Portal",
      reputation: "Credential harvesting phishing page"
    },
    aiReasoning: "URL mimics Microsoft 365 OAuth login landing page. User clicked via inbound email attachment. No evidence of token grant submission detected yet.",
    recommendedActions: [
      "Block URL phishing-update.login-security.net on Secure Web Gateway",
      "Purge phishing email message from all employee mailboxes",
      "Prompt targeted user for proactive MFA reset"
    ],
    incidentReport: `# Incident Report: INV-2026-004
**Target IOC:** http://phishing-update... (URL)
**Risk Level:** MEDIUM (Score: 65/100)
**Detection Timestamp:** 2026-08-01 14:10:00 UTC`
  },
  {
    id: "INV-2026-005",
    iocType: "IP Address",
    iocValue: "203.0.113.89",
    riskLevel: "Low",
    status: "Completed",
    date: "2026-08-01 11:05 UTC",
    threatIntel: {
      virusTotal: "2/90 Security Vendors Flagged Suspicious",
      abuseIpdb: "Public Cloud Scanner (Shodan Node)",
      reputation: "Automated internet port scanner"
    },
    aiReasoning: "IP performed routine TCP port 80/443 syn scans. No privilege escalation or exploit attempt observed.",
    recommendedActions: [
      "Maintain standard perimeter rate limiting",
      "No host isolation required"
    ],
    incidentReport: `# Incident Report: INV-2026-005
**Target IOC:** 203.0.113.89 (IP Address)
**Risk Level:** LOW (Score: 22/100)`
  }
];

export const MOCK_METRICS = {
  totalInvestigated: 42,
  highRiskThreats: 14,
  cleanIocs: 28,
  avgSpeed: "4.8 sec",
  vtApiStatus: "CONNECTED",
  abuseApiStatus: "CONNECTED"
};
