import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  Copy, 
  Check, 
  Terminal, 
  FileText, 
  Globe, 
  Server, 
  Zap,
  ArrowLeft,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Badge, getSeverityVariant } from '../common/Badge';

export const InvestigationResults = ({ resultData, onReset }) => {
  const [copied, setCopied] = useState(false);

  if (!resultData) return null;

  const ioc = resultData.ioc || resultData.iocValue || 'Unknown IOC';
  const iocType = resultData.ioc_type || resultData.iocType || 'Unknown Type';
  const riskLevel = resultData.risk_level || resultData.riskLevel || 'Low';
  const vt = resultData.virustotal || resultData.threatIntel?.raw?.virustotal;
  const abuse = resultData.abuseipdb;

  // Dynamic AI Reasoning generation from backend data
  const aiReasoning = resultData.aiReasoning || (() => {
    let summary = `Automated threat intelligence correlation completed for ${iocType} "${ioc}". The system evaluated vendor reputation and assigned a risk level of ${riskLevel.toUpperCase()}.\n\n`;
    if (vt) {
      summary += `• VirusTotal Analysis: ${vt.malicious} vendor(s) flagged this target as malicious, ${vt.suspicious} flagged suspicious, ${vt.harmless} marked harmless, and ${vt.undetected} was undetected (Reputation Score: ${vt.reputation}).\n`;
    }
    if (abuse) {
      summary += `• AbuseIPDB Analysis: Abuse Confidence Score is ${abuse.abuseConfidenceScore}% with ${abuse.totalReports} total report(s). ISP: ${abuse.isp || 'N/A'}, Country: ${abuse.countryCode || 'N/A'}, Usage: ${abuse.usageType || 'N/A'}, Last Reported: ${abuse.lastReportedAt || 'N/A'}.\n`;
    } else if (iocType !== 'IP Address') {
      summary += `• AbuseIPDB Analysis: Not applicable for ${iocType}.\n`;
    }
    return summary;
  })();

  // Dynamic Incident Report generation from backend data
  const incidentReport = resultData.incidentReport || (() => {
    const timestamp = resultData.date || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    let report = `# AI SOC Incident Investigation Report
**Target IOC:** ${ioc}
**IOC Type:** ${iocType}
**Assigned Risk Level:** ${riskLevel.toUpperCase()}
**Scan Timestamp:** ${timestamp}

---

### 1. Threat Intelligence Correlation

#### VirusTotal Detection Summary
- **Malicious:** ${vt ? vt.malicious : 0}
- **Suspicious:** ${vt ? vt.suspicious : 0}
- **Harmless:** ${vt ? vt.harmless : 0}
- **Undetected:** ${vt ? vt.undetected : 0}
- **Reputation Score:** ${vt ? vt.reputation : 'N/A'}

#### AbuseIPDB Intelligence
${abuse ? `- **Abuse Confidence Score:** ${abuse.abuseConfidenceScore}%
- **Country:** ${abuse.countryCode || 'N/A'}
- **ISP:** ${abuse.isp || 'N/A'}
- **Usage Type:** ${abuse.usageType || 'N/A'}
- **Total Reports:** ${abuse.totalReports}
- **Last Reported Date:** ${abuse.lastReportedAt || 'N/A'}` : `Not applicable for this IOC type (${iocType}).`}

---

### 2. Automated AI SOC Triage
Target ${iocType} "${ioc}" evaluated with risk level **${riskLevel.toUpperCase()}**.
${vt && vt.malicious > 0 ? `Flagged by ${vt.malicious} security vendor(s) for active malicious indicators.` : 'No malicious flags observed in current threat feeds.'}

---

### 3. Recommended Playbook Actions
1. Block ${iocType} (${ioc}) at edge firewall and boundary proxy filters.
2. Isolate connections associated with ${ioc} across internal host endpoints.
3. Continuously monitor SIEM logs for related indicators.
`;
    return report;
  })();

  const handleCopyReport = () => {
    navigator.clipboard.writeText(incidentReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyber-border bg-cyber-surface text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
            title="Start Another Investigation"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="font-bold text-cyber-accent">{resultData.id || 'INV-2026-LIVE'}</span>
              <span className="text-cyber-muted">•</span>
              <span className="text-cyber-muted">{resultData.date || 'Just now'}</span>
            </div>
            <h2 className="text-lg font-bold text-cyber-text flex items-center gap-2">
              Investigation Results for <span className="font-mono text-emerald-400">{ioc}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={getSeverityVariant(riskLevel)} size="lg">
            RISK LEVEL: {riskLevel.toUpperCase()}
          </Badge>
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl bg-cyber-accent px-4 py-2 text-xs font-bold text-cyber-bg hover:opacity-90 transition-all shadow-cyber-glow"
          >
            <Zap className="h-4 w-4" /> New Investigation
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: IOC Metadata, VirusTotal Summary Card & AbuseIPDB Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card 1: IOC Overview */}
          <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3">
              <Globe className="h-4 w-4 text-cyber-accent" /> IOC Overview
            </h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-cyber-muted block text-[10px] uppercase">IOC Target Value</span>
                <span className="font-bold text-emerald-400 break-all">{ioc}</span>
              </div>

              <div>
                <span className="text-cyber-muted block text-[10px] uppercase">Auto-Detected IOC Type</span>
                <span className="font-bold text-cyber-text">{iocType}</span>
              </div>

              <div>
                <span className="text-cyber-muted block text-[10px] uppercase">Assigned Risk Level</span>
                <Badge variant={getSeverityVariant(riskLevel)}>
                  {riskLevel}
                </Badge>
              </div>

              <div>
                <span className="text-cyber-muted block text-[10px] uppercase">Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> COMPLETED
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: VirusTotal Summary Card */}
          <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-cyber-text flex items-center justify-between border-b border-cyber-border/60 pb-3">
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyber-accent" /> VirusTotal Summary
              </span>
              <span className="text-[10px] font-mono text-cyber-muted">API v3</span>
            </h3>

            {vt ? (
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                  <span className="text-red-400 block text-[10px] uppercase font-bold">Malicious</span>
                  <span className="text-lg font-bold text-red-400">{vt.malicious}</span>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <span className="text-amber-400 block text-[10px] uppercase font-bold">Suspicious</span>
                  <span className="text-lg font-bold text-amber-400">{vt.suspicious}</span>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <span className="text-emerald-400 block text-[10px] uppercase font-bold">Harmless</span>
                  <span className="text-lg font-bold text-emerald-400">{vt.harmless}</span>
                </div>

                <div className="rounded-xl border border-cyber-border bg-cyber-surface/60 p-3">
                  <span className="text-cyber-muted block text-[10px] uppercase font-bold">Undetected</span>
                  <span className="text-lg font-bold text-slate-300">{vt.undetected}</span>
                </div>

                <div className="col-span-2 rounded-xl border border-cyber-accent/30 bg-cyber-accent/10 p-3 flex justify-between items-center">
                  <span className="text-cyber-accent text-[11px] font-bold">Reputation Score</span>
                  <span className="text-sm font-bold text-cyber-accent">{vt.reputation}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-cyber-muted italic">No VirusTotal summary available.</p>
            )}
          </div>

          {/* Card 3: AbuseIPDB Summary Card */}
          <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-cyber-text flex items-center justify-between border-b border-cyber-border/60 pb-3">
              <span className="flex items-center gap-2">
                <Server className="h-4 w-4 text-cyber-accent" /> AbuseIPDB Summary
              </span>
              <span className="text-[10px] font-mono text-cyber-muted">API v2</span>
            </h3>

            {abuse ? (
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                  <span className="text-cyber-muted text-[11px]">Abuse Confidence Score</span>
                  <span className={`font-bold ${
                    abuse.abuseConfidenceScore > 50 
                      ? 'text-red-400' 
                      : abuse.abuseConfidenceScore > 0 
                      ? 'text-amber-400' 
                      : 'text-emerald-400'
                  }`}>
                    {abuse.abuseConfidenceScore}%
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                  <span className="text-cyber-muted text-[11px]">Country</span>
                  <span className="font-bold text-cyber-text">{abuse.countryCode || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                  <span className="text-cyber-muted text-[11px]">ISP</span>
                  <span className="font-bold text-cyber-text truncate max-w-[160px]" title={abuse.isp}>{abuse.isp || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                  <span className="text-cyber-muted text-[11px]">Usage Type</span>
                  <span className="font-bold text-cyber-text truncate max-w-[160px]" title={abuse.usageType}>{abuse.usageType || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                  <span className="text-cyber-muted text-[11px]">Total Reports</span>
                  <span className="font-bold text-cyber-accent">{abuse.totalReports ?? 'N/A'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                  <span className="text-cyber-muted text-[11px]">Last Reported Date</span>
                  <span className="font-bold text-slate-300 text-[10px]">{abuse.lastReportedAt || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-cyber-border/60 bg-cyber-surface/40 p-4 text-center">
                <Info className="h-5 w-5 text-cyber-muted mx-auto mb-1.5" />
                <p className="text-xs font-mono text-cyber-muted">Not applicable for this IOC type.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Reasoning, Recommended Actions & Formatted Incident Report */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 4: AI Reasoning & Investigation Summary */}
          <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3 font-mono">
              <Terminal className="h-4 w-4 text-cyber-accent" /> AI SOC Investigation Summary
            </h3>
            <div className="p-4 rounded-xl border border-cyber-border/60 bg-slate-950/60 font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {aiReasoning}
            </div>
          </div>

          {/* Card 5: Recommended Playbook Actions */}
          <div className="rounded-2xl border border-cyber-accent/30 bg-cyber-accent/5 p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-cyber-accent flex items-center gap-2 border-b border-cyber-accent/20 pb-3 font-mono">
              <CheckCircle className="h-4 w-4" /> Recommended Playbook Actions
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {[
                `Immediately block ${iocType} (${ioc}) on edge firewalls, DNS filters, and web proxies`,
                `Isolate network connections and initiate host memory scan on impacted endpoints`,
                `Revoke active user session tokens if authentication anomalies are identified`,
                `Continue real-time SIEM logging and monitor for related secondary indicators`
              ].map((act, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-cyber-accent/20 border border-cyber-accent/40 text-cyber-accent flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <span className="mt-0.5">{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 6: Formatted Incident Report */}
          <div className="overflow-hidden rounded-2xl border border-cyber-border bg-cyber-bg shadow-2xl">
            <div className="flex items-center justify-between border-b border-cyber-border bg-cyber-surface/90 px-4 py-3">
              <span className="flex items-center gap-2 text-xs font-mono font-bold text-cyber-accent">
                <FileText className="h-4 w-4" /> Formatted Incident Report
              </span>
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 rounded-lg border border-cyber-border px-2.5 py-1 text-xs font-mono text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Report Copied' : 'Copy Report'}
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
              <pre className="whitespace-pre-wrap font-mono">{incidentReport}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
