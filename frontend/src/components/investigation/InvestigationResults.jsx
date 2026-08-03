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
  Info,
  Sparkles,
  Download,
  Loader2
} from 'lucide-react';
import { Badge, getSeverityVariant } from '../common/Badge';
import { downloadPdfReport } from '../../services/api';

export const InvestigationResults = ({ resultData, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!resultData) return null;

  const ioc = resultData.ioc || resultData.iocValue || 'Unknown IOC';
  const iocType = resultData.ioc_type || resultData.iocType || 'Unknown Type';
  const riskLevel = resultData.risk_level || resultData.riskLevel || 'Low';
  const vt = resultData.virustotal || resultData.threatIntel?.raw?.virustotal;
  const abuse = resultData.abuseipdb || resultData.threatIntel?.raw?.abuseipdb;

  // Helper parser for backend-generated AI summary string (supports optional colons)
  const parseAiSummary = (text) => {
    if (!text || typeof text !== 'string' || !text.trim()) {
      return null;
    }

    const overallMatch = text.match(/OVERALL ASSESSMENT:?\s*([\s\S]*?)(?=(THREAT RATIONALE:?|RECOMMENDED NEXT ACTIONS:?|$))/i);
    const rationaleMatch = text.match(/THREAT RATIONALE:?\s*([\s\S]*?)(?=(RECOMMENDED NEXT ACTIONS:?|$))/i);
    const actionsMatch = text.match(/RECOMMENDED NEXT ACTIONS:?\s*([\s\S]*?)$/i);

    if (overallMatch || rationaleMatch || actionsMatch) {
      const overall = overallMatch ? overallMatch[1].trim() : '';
      const rationale = rationaleMatch ? rationaleMatch[1].trim() : '';
      const actions = actionsMatch ? actionsMatch[1].trim() : '';

      if (overall || rationale || actions) {
        return { overall, rationale, actions };
      }
    }

    return null;
  };

  // Helper to parse actions into a numbered list if items exist
  const parseActionItems = (actionsText) => {
    if (!actionsText || typeof actionsText !== 'string') return [];

    const lineItems = actionsText
      .split(/(?:^|\n)\s*(?:\d+[\.\)]|\bullet|-|\*)\s+/)
      .map(item => item.trim())
      .filter(Boolean);

    if (lineItems.length > 1) {
      return lineItems;
    }

    const inlineItems = actionsText
      .split(/(?=\b\d+[\.\)]\s+)/)
      .map(item => item.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);

    if (inlineItems.length > 1) {
      return inlineItems;
    }

    return [actionsText];
  };

  // Raw AI summary from backend
  const rawAiSummary = resultData.ai_summary 
    || resultData.summary 
    || resultData.gemini_summary 
    || resultData.ai_investigation_summary 
    || resultData.aiReasoning;

  const parsedSummary = parseAiSummary(rawAiSummary);
  const actionItems = parseActionItems(parsedSummary?.actions);
  const aiSummary = rawAiSummary || 'No AI investigation summary available.';

  // Current Date & Time
  const currentDateAndTime = resultData.date || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  // Format incident report string for clipboard
  const formattedReport = `INCIDENT INVESTIGATION REPORT
=================================
IOC: ${ioc}
IOC Type: ${iocType}
Risk Level: ${riskLevel.toUpperCase()}
Date & Time: ${currentDateAndTime}
Investigation Status: Completed

THREAT INTELLIGENCE
-------------------
VirusTotal: ${vt ? `Malicious: ${vt.malicious}, Suspicious: ${vt.suspicious}, Harmless: ${vt.harmless}, Undetected: ${vt.undetected}, Reputation: ${vt.reputation}` : 'Not available'}
AbuseIPDB: ${abuse ? `Confidence Score: ${abuse.abuseConfidenceScore}%, Country: ${abuse.countryCode || 'N/A'}, ISP: ${abuse.isp || 'N/A'}, Usage: ${abuse.usageType || 'N/A'}, Reports: ${abuse.totalReports ?? 'N/A'}, Last Reported: ${abuse.lastReportedAt || 'N/A'}` : 'Not applicable for this IOC type.'}

AI INVESTIGATION SUMMARY
------------------------
${aiSummary}`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(formattedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!resultData.id) {
      alert("Investigation record ID not available to download PDF.");
      return;
    }
    setDownloadingPdf(true);
    try {
      await downloadPdfReport(resultData.id, ioc);
    } catch (err) {
      console.error('Download PDF report error:', err);
      alert('Failed to generate and download PDF report. Please verify backend service.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
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
              <span className="text-cyber-muted">{currentDateAndTime}</span>
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

      {/* Row 1: Investigation Overview, VirusTotal Summary Card, AbuseIPDB Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Investigation Overview */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3 font-mono">
            <Globe className="h-4 w-4 text-cyber-accent" /> Investigation Overview
          </h3>
          
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center p-3 rounded-xl bg-cyber-surface/60 border border-cyber-border/60">
              <span className="text-cyber-muted uppercase text-[10px] font-bold">IOC</span>
              <span className="font-bold text-emerald-400 break-all text-right ml-2">{ioc}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-cyber-surface/60 border border-cyber-border/60">
              <span className="text-cyber-muted uppercase text-[10px] font-bold">IOC Type</span>
              <span className="font-bold text-cyber-text">{iocType}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-cyber-surface/60 border border-cyber-border/60">
              <span className="text-cyber-muted uppercase text-[10px] font-bold">Risk Level</span>
              <Badge variant={getSeverityVariant(riskLevel)}>
                {riskLevel}
              </Badge>
            </div>
          </div>

          <div className="pt-2 text-[10px] font-mono text-cyber-muted flex items-center justify-between border-t border-cyber-border/40 mt-4">
            <span>Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> ACTIVE TRIAGE
            </span>
          </div>
        </div>

        {/* Card 2: VirusTotal Summary Card */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-cyber-text flex items-center justify-between border-b border-cyber-border/60 pb-3 font-mono">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyber-accent" /> VirusTotal Summary Card
            </span>
            <span className="text-[10px] font-mono text-cyber-muted">VT API</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <span className="text-red-400 block text-[10px] uppercase font-bold">Malicious</span>
              <span className="text-xl font-bold text-red-400">{vt ? vt.malicious : 0}</span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <span className="text-amber-400 block text-[10px] uppercase font-bold">Suspicious</span>
              <span className="text-xl font-bold text-amber-400">{vt ? vt.suspicious : 0}</span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <span className="text-emerald-400 block text-[10px] uppercase font-bold">Harmless</span>
              <span className="text-xl font-bold text-emerald-400">{vt ? vt.harmless : 0}</span>
            </div>

            <div className="rounded-xl border border-cyber-border bg-cyber-surface/60 p-3">
              <span className="text-cyber-muted block text-[10px] uppercase font-bold">Undetected</span>
              <span className="text-xl font-bold text-slate-300">{vt ? vt.undetected : 0}</span>
            </div>

            <div className="col-span-2 rounded-xl border border-cyber-accent/30 bg-cyber-accent/10 p-3 flex justify-between items-center">
              <span className="text-cyber-accent text-[11px] font-bold">Reputation</span>
              <span className="text-base font-bold text-cyber-accent">{vt ? vt.reputation : 0}</span>
            </div>
          </div>
        </div>

        {/* Card 3: AbuseIPDB Summary Card */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-cyber-text flex items-center justify-between border-b border-cyber-border/60 pb-3 font-mono">
            <span className="flex items-center gap-2">
              <Server className="h-4 w-4 text-cyber-accent" /> AbuseIPDB Summary Card
            </span>
            <span className="text-[10px] font-mono text-cyber-muted">API v2</span>
          </h3>

          {abuse ? (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted text-[11px]">abuseConfidenceScore</span>
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
                <span className="text-cyber-muted text-[11px]">countryCode</span>
                <span className="font-bold text-cyber-text">{abuse.countryCode || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted text-[11px]">isp</span>
                <span className="font-bold text-cyber-text truncate max-w-[150px]" title={abuse.isp}>{abuse.isp || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted text-[11px]">usageType</span>
                <span className="font-bold text-cyber-text truncate max-w-[150px]" title={abuse.usageType}>{abuse.usageType || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted text-[11px]">totalReports</span>
                <span className="font-bold text-cyber-accent">{abuse.totalReports ?? 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted text-[11px]">lastReportedAt</span>
                <span className="font-bold text-slate-300 text-[10px]">{abuse.lastReportedAt || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-cyber-border/60 bg-cyber-surface/40 p-6 text-center space-y-2">
              <Info className="h-6 w-6 text-cyber-muted mx-auto" />
              <p className="text-xs font-mono text-cyber-muted">Not applicable for this IOC type.</p>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: AI Investigation Summary Card & Incident Report Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 4: AI Investigation Summary Card */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4 shadow-xl flex flex-col">
          <h3 className="text-sm font-bold text-cyber-text flex items-center justify-between border-b border-cyber-border/60 pb-3 font-mono">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyber-accent" /> AI Investigation Summary Card
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">GEMINI AI</span>
          </h3>

          <div className="p-4 rounded-xl border border-cyber-border/60 bg-slate-950/70 font-mono text-xs text-slate-200 leading-relaxed flex-grow max-h-[420px] overflow-y-auto space-y-5">
            {!rawAiSummary ? (
              <p className="text-cyber-muted italic">No AI investigation summary available.</p>
            ) : parsedSummary ? (
              <>
                {/* OVERALL ASSESSMENT SECTION */}
                {parsedSummary.overall && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-cyan-400 text-xs tracking-wider uppercase flex items-center gap-2 border-b border-cyan-500/20 pb-1.5 font-mono">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span> OVERALL ASSESSMENT
                    </h4>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed pl-1">{parsedSummary.overall}</p>
                  </div>
                )}

                {/* THREAT RATIONALE SECTION */}
                {parsedSummary.rationale && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-purple-400 text-xs tracking-wider uppercase flex items-center gap-2 border-b border-purple-500/20 pb-1.5 font-mono">
                      <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span> THREAT RATIONALE
                    </h4>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed pl-1">{parsedSummary.rationale}</p>
                  </div>
                )}

                {/* RECOMMENDED NEXT ACTIONS SECTION */}
                {parsedSummary.actions && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-emerald-400 text-xs tracking-wider uppercase flex items-center gap-2 border-b border-emerald-500/20 pb-1.5 font-mono">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> RECOMMENDED NEXT ACTIONS
                    </h4>
                    {actionItems.length > 1 ? (
                      <ol className="space-y-2.5 pt-1 pl-1">
                        {actionItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-slate-300">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold font-mono mt-0.5 shadow-sm">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed mt-0.5">{item}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed pl-1">{parsedSummary.actions}</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="whitespace-pre-wrap text-slate-200">{rawAiSummary}</div>
            )}
          </div>
        </div>

        {/* Card 5: Incident Report Card */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
              <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 font-mono">
                <FileText className="h-4 w-4 text-cyber-accent" /> Incident Report Card
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyReport}
                  className="flex items-center gap-1.5 rounded-lg border border-cyber-border bg-cyber-surface/80 px-3 py-1 text-xs font-mono text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="flex items-center gap-1.5 rounded-lg border border-cyber-accent/40 bg-cyber-accent/20 px-3 py-1 text-xs font-mono text-cyber-accent font-bold hover:bg-cyber-accent/30 hover:border-cyber-accent transition-all disabled:opacity-50"
                  title="Download Printable PDF Incident Report"
                >
                  {downloadingPdf ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  {downloadingPdf ? 'Generating...' : 'Download PDF'}
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center p-3 rounded-xl bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted uppercase text-[10px] font-bold">IOC</span>
                <span className="font-bold text-emerald-400 break-all text-right ml-2">{ioc}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted uppercase text-[10px] font-bold">IOC Type</span>
                <span className="font-bold text-cyber-text">{iocType}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted uppercase text-[10px] font-bold">Risk Level</span>
                <Badge variant={getSeverityVariant(riskLevel)}>
                  {riskLevel}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted uppercase text-[10px] font-bold">Current Date & Time</span>
                <span className="font-bold text-slate-300 text-[11px]">{currentDateAndTime}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-cyber-surface/60 border border-cyber-border/60">
                <span className="text-cyber-muted uppercase text-[10px] font-bold">Investigation Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" /> Completed
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


