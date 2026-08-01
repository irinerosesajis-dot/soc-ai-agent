import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  Copy, 
  Check, 
  Terminal, 
  FileText, 
  AlertTriangle, 
  Globe, 
  Server, 
  ExternalLink,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { Badge, getSeverityVariant } from '../common/Badge';

export const InvestigationResults = ({ resultData, onReset }) => {
  const [copied, setCopied] = useState(false);

  if (!resultData) return null;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(resultData.incidentReport || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md">
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
              <span className="font-bold text-cyber-accent">{resultData.id}</span>
              <span className="text-cyber-muted">•</span>
              <span className="text-cyber-muted">{resultData.date}</span>
            </div>
            <h2 className="text-lg font-bold text-cyber-text flex items-center gap-2">
              Investigation Results for <span className="font-mono text-cyber-accent">{resultData.iocValue}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={getSeverityVariant(resultData.riskLevel)} size="lg">
            RISK LEVEL: {resultData.riskLevel?.toUpperCase()}
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
        {/* Left Column: Metadata & Threat Intel Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card 1: IOC Information */}
          <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3">
              <Globe className="h-4 w-4 text-cyber-accent" /> IOC Information
            </h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-cyber-muted block text-[10px] uppercase">IOC Type</span>
                <span className="font-bold text-cyber-text">{resultData.iocType}</span>
              </div>

              <div>
                <span className="text-cyber-muted block text-[10px] uppercase">IOC Target Value</span>
                <span className="font-bold text-emerald-400 break-all">{resultData.iocValue}</span>
              </div>

              <div>
                <span className="text-cyber-muted block text-[10px] uppercase">Assigned Risk Level</span>
                <Badge variant={getSeverityVariant(resultData.riskLevel)}>
                  {resultData.riskLevel}
                </Badge>
              </div>

              <div>
                <span className="text-cyber-muted block text-[10px] uppercase">Investigation Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> COMPLETED
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Threat Intelligence Summary */}
          <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3">
              <Server className="h-4 w-4 text-cyber-accent" /> Threat Intelligence Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg border border-cyber-border/60 bg-cyber-surface/60 p-3 space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-cyber-accent text-[11px]">
                  <span>VirusTotal Score</span>
                  <span className="text-rose-400">Malicious</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px]">
                  {resultData.threatIntel?.virusTotal || '48/92 Security Vendors Flagged Malicious'}
                </p>
              </div>

              <div className="rounded-lg border border-cyber-border/60 bg-cyber-surface/60 p-3 space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-cyber-accent text-[11px]">
                  <span>AbuseIPDB Rating</span>
                  <span className="text-amber-400">High Confidence</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px]">
                  {resultData.threatIntel?.abuseIpdb || '94% Confidence Score (Reported 142 times for C2 activity)'}
                </p>
              </div>

              {resultData.threatIntel?.reputation && (
                <div className="rounded-lg border border-cyber-border/60 bg-cyber-surface/60 p-3 space-y-1">
                  <span className="font-mono font-bold text-cyber-muted text-[10px] uppercase">Threat Reputation</span>
                  <p className="text-slate-300 font-mono text-[11px]">{resultData.threatIntel.reputation}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Reasoning, Recommended Actions & Report */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 3: AI Reasoning */}
          <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-3">
            <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3">
              <Terminal className="h-4 w-4 text-cyber-accent" /> AI Reasoning & Synthesis
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {resultData.aiReasoning}
            </p>
          </div>

          {/* Card 4: Recommended Actions */}
          <div className="rounded-xl border border-cyber-accent/30 bg-cyber-accent/5 p-5 space-y-3">
            <h3 className="text-sm font-bold text-cyber-accent flex items-center gap-2 border-b border-cyber-accent/20 pb-3 font-mono">
              <CheckCircle className="h-4 w-4" /> Recommended Playbook Actions
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {resultData.recommendedActions?.map((act, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-cyber-accent/20 border border-cyber-accent/40 text-cyber-accent flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <span className="mt-0.5">{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 5: Generated Incident Report */}
          <div className="overflow-hidden rounded-xl border border-cyber-border bg-cyber-bg shadow-2xl">
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
              <pre className="whitespace-pre-wrap font-mono">{resultData.incidentReport}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
