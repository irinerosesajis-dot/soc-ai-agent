import React from 'react';
import { StatCard } from '../components/common/StatCard';
import { ThreatOverviewChart } from '../components/dashboard/IncidentChart';
import { MOCK_METRICS } from '../mockData/incidents';
import { ShieldAlert, Zap, PlusCircle, CheckCircle2, Clock, Activity } from 'lucide-react';

export const DashboardPage = ({ onNavigateNew }) => {
  return (
    <div className="space-y-6">
      {/* Primary Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-cyber-accent/30 bg-gradient-to-r from-cyber-card via-cyber-surface to-cyber-bg p-6 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyber-accent/20 border border-cyber-accent/40 text-cyber-accent shadow-cyber-glow">
            <Zap className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyber-accent uppercase tracking-wider">
              <span>AI SOC AGENT</span> • <span>IOC INVESTIGATION ENGINE ACTIVE</span>
            </div>
            <h2 className="text-xl font-bold text-cyber-text">
              Automated Incident & IOC Triage Platform
            </h2>
            <p className="text-xs text-cyber-muted mt-0.5">
              Analyze IP addresses, domain names, URLs, and file hashes with automated VirusTotal & AbuseIPDB threat intelligence correlation.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateNew}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-accent to-blue-600 px-5 py-3 text-xs font-bold text-slate-950 shadow-cyber-glow hover:opacity-95 transition-all shrink-0 font-mono"
        >
          <PlusCircle className="h-4 w-4" /> Start New IOC Investigation
        </button>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total IOCs Investigated"
          value={MOCK_METRICS.totalInvestigated}
          subtitle="Audit repository size"
          icon={Activity}
          color="cyan"
        />
        <StatCard
          title="High Risk Threat Detections"
          value={MOCK_METRICS.highRiskThreats}
          subtitle="Flagged by VT & AbuseIPDB"
          icon={ShieldAlert}
          color="rose"
        />
        <StatCard
          title="Clean / Low Risk IOCs"
          value={MOCK_METRICS.cleanIocs}
          subtitle="Verified safe indicators"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Avg Investigation Speed"
          value={MOCK_METRICS.avgSpeed}
          subtitle="Per threat pipeline execution"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Single Threat Overview Chart */}
      <div className="max-w-4xl mx-auto">
        <ThreatOverviewChart />
      </div>
    </div>
  );
};
