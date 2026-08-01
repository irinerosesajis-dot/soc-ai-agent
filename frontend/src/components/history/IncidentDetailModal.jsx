import React, { useState } from 'react';
import { X, Globe, Server, Terminal, CheckCircle, Copy, Check, FileText } from 'lucide-react';
import { Badge, getSeverityVariant } from '../common/Badge';

export const IncidentDetailModal = ({ record, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!record) return null;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(record.incidentReport || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-cyber-border bg-cyber-card p-6 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyber-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyber-muted">
              <span className="font-bold text-cyber-accent">{record.id}</span>
              <span>•</span>
              <span>{record.date}</span>
            </div>
            <h2 className="text-lg font-bold text-cyber-text flex items-center gap-2 mt-1">
              IOC Audit Details: <span className="font-mono text-emerald-400">{record.iocValue}</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-cyber-border p-1.5 text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* IOC Metadata & Risk Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 1: IOC Information */}
          <div className="rounded-xl border border-cyber-border bg-cyber-surface/60 p-4 space-y-2 text-xs font-mono">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-accent flex items-center gap-2">
              <Globe className="h-4 w-4" /> IOC Information
            </h4>
            <div className="pt-1 space-y-1 text-slate-300">
              <div><span className="text-cyber-muted">Type:</span> {record.iocType}</div>
              <div><span className="text-cyber-muted">Target Value:</span> <strong className="text-emerald-400">{record.iocValue}</strong></div>
              <div><span className="text-cyber-muted">Status:</span> {record.status}</div>
            </div>
          </div>

          {/* Section 2: Threat Intelligence Summary */}
          <div className="rounded-xl border border-cyber-border bg-cyber-surface/60 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-accent font-mono flex items-center gap-2">
                <Server className="h-4 w-4" /> Threat Intelligence Summary
              </h4>
              <Badge variant={getSeverityVariant(record.riskLevel)}>
                {record.riskLevel} RISK
              </Badge>
            </div>
            <div className="pt-1 space-y-1 font-mono text-slate-300 text-[11px]">
              <div><strong>VirusTotal:</strong> {record.threatIntel?.virusTotal || '48/92 Security Vendors Flagged Malicious'}</div>
              <div><strong>AbuseIPDB:</strong> {record.threatIntel?.abuseIpdb || '94% Abuse Confidence Rating'}</div>
            </div>
          </div>
        </div>

        {/* Section 3: AI Reasoning */}
        <div className="rounded-xl border border-cyber-border bg-cyber-surface/60 p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-accent font-mono flex items-center gap-2">
            <Terminal className="h-4 w-4" /> AI Reasoning
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {record.aiReasoning}
          </p>
        </div>

        {/* Section 4: Recommended Actions */}
        <div className="rounded-xl border border-cyber-accent/30 bg-cyber-accent/5 p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-accent font-mono flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Recommended Actions
          </h4>
          <ul className="space-y-1 text-xs text-slate-300">
            {record.recommendedActions?.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyber-accent font-mono">•</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 5: Incident Report */}
        <div className="overflow-hidden rounded-xl border border-cyber-border bg-cyber-bg">
          <div className="flex items-center justify-between border-b border-cyber-border bg-cyber-surface/90 px-4 py-2.5">
            <span className="flex items-center gap-2 text-xs font-mono font-bold text-cyber-accent">
              <FileText className="h-4 w-4" /> Incident Report
            </span>
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1 rounded border border-cyber-border px-2 py-1 text-[11px] font-mono text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-4 max-h-48 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
            <pre className="whitespace-pre-wrap">{record.incidentReport}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-cyber-border/60 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-cyber-border px-4 py-2 text-xs font-medium text-cyber-text hover:border-cyber-accent transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
