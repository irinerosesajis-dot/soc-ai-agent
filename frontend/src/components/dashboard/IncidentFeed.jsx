import React, { useState } from 'react';
import { Badge, getSeverityVariant, getStatusVariant } from '../common/Badge';
import { AlertCircle, ExternalLink, ShieldCheck, Terminal, Filter, Eye } from 'lucide-react';

export const IncidentFeed = ({ incidents, onSelectIncident, onStartInvestigation }) => {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredIncidents = filterSeverity === 'ALL'
    ? incidents
    : incidents.filter(item => item.severity.toUpperCase() === filterSeverity);

  return (
    <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border/60 pb-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-cyber-text flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-cyber-accent" /> Live Security Incident Stream
          </h2>
          <p className="text-xs text-cyber-muted">Real-time alert ingest from EDR, SIEM & Firewall connectors</p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-lg border border-cyber-border bg-cyber-surface/80 p-1 text-xs">
          <Filter className="h-3.5 w-3.5 text-cyber-muted ml-1" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                filterSeverity === sev
                  ? 'bg-cyber-accent text-cyber-bg font-bold shadow-sm'
                  : 'text-cyber-muted hover:text-cyber-text'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      <div className="mt-4 divide-y divide-cyber-border/40">
        {filteredIncidents.length === 0 ? (
          <div className="py-12 text-center text-xs text-cyber-muted">
            No incidents match the selected filter criteria.
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 transition-colors hover:bg-cyber-surface/40 px-2 rounded-lg"
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-1">
                  <Badge variant={getSeverityVariant(incident.severity)}>
                    {incident.severity}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyber-accent">{incident.id}</span>
                    <span className="text-xs text-cyber-muted">•</span>
                    <span className="text-xs font-medium text-cyber-muted font-mono">{incident.source}</span>
                    <span className="text-xs text-cyber-muted">•</span>
                    <span className="text-xs text-cyber-muted">{incident.timestamp}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-cyber-text group-hover:text-cyber-accent transition-colors">
                    {incident.title}
                  </h4>

                  <p className="text-xs text-cyber-muted line-clamp-1">
                    Target: <span className="font-mono text-slate-300">{incident.targetAsset}</span> — {incident.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <Badge variant={getStatusVariant(incident.status)}>
                  {incident.status}
                </Badge>

                <button
                  onClick={() => onSelectIncident(incident)}
                  className="flex items-center gap-1.5 rounded-lg border border-cyber-border bg-cyber-card px-3 py-1.5 text-xs font-medium text-cyber-text hover:border-cyber-accent hover:text-cyber-accent transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> Details
                </button>

                <button
                  onClick={() => onStartInvestigation(incident)}
                  className="flex items-center gap-1.5 rounded-lg bg-cyber-accent/15 border border-cyber-accent/40 px-3 py-1.5 text-xs font-semibold text-cyber-accent hover:bg-cyber-accent hover:text-cyber-bg transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                >
                  <Terminal className="h-3.5 w-3.5" /> Run AI Triage
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
