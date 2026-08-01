import React from 'react';
import { ShieldAlert, TrendingUp } from 'lucide-react';

export const ThreatOverviewChart = () => {
  const riskLevels = [
    { level: 'Critical Risk', count: 18, color: 'bg-rose-500', barWidth: '45%' },
    { level: 'High Risk', count: 12, color: 'bg-amber-500', barWidth: '30%' },
    { level: 'Medium Risk', count: 8, color: 'bg-cyan-500', barWidth: '20%' },
    { level: 'Low Risk / Clean', count: 4, color: 'bg-slate-600', barWidth: '10%' },
  ];

  return (
    <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-cyber-text flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-cyber-accent" /> IOC Risk Classification Overview
          </h3>
          <p className="text-xs text-cyber-muted">Aggregated risk breakdown from automated VirusTotal & AbuseIPDB scans</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 font-mono">
          <TrendingUp className="h-3.5 w-3.5" /> 42 Total IOCs
        </span>
      </div>

      <div className="space-y-3.5 pt-2">
        {riskLevels.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyber-text flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`}></span>
                {item.level}
              </span>
              <span className="text-cyber-muted font-bold">{item.count} Detections</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-cyber-surface">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: item.barWidth }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
