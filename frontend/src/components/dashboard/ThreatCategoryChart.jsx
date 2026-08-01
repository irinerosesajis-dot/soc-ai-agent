import React from 'react';
import { PieChart, ShieldCheck, Zap } from 'lucide-react';

export const ThreatCategoryChart = () => {
  const categories = [
    { name: 'Credential Access', count: 34, color: 'bg-rose-500', pct: '34%' },
    { name: 'Ransomware / Encryptor', count: 28, color: 'bg-amber-500', pct: '28%' },
    { name: 'Data Exfiltration', count: 18, color: 'bg-cyan-500', pct: '18%' },
    { name: 'Initial Access (SSH/VPN)', count: 12, color: 'bg-purple-500', pct: '12%' },
    { name: 'IAM / Cloud Persistence', count: 8, color: 'bg-emerald-500', pct: '8%' },
  ];

  return (
    <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-4">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-cyber-text flex items-center gap-2">
            <PieChart className="h-4 w-4 text-cyber-accent" /> Threat Matrix Distribution
          </h3>
          <p className="text-xs text-cyber-muted">MITRE ATT&CK tactical category breakdown</p>
        </div>
        <span className="rounded-full bg-cyber-purple/20 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-cyber-purple border border-cyber-purple/30">
          MITRE v14
        </span>
      </div>

      <div className="mt-4 space-y-3.5">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyber-text flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${cat.color}`}></span>
                {cat.name}
              </span>
              <span className="text-cyber-muted font-bold">{cat.count} ({cat.pct})</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-cyber-surface">
              <div
                className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                style={{ width: cat.pct }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-cyber-accent/20 bg-cyber-accent/5 p-3 text-xs text-cyber-muted flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-cyber-accent font-mono text-[11px]">
          <Zap className="h-3.5 w-3.5" /> Auto-playbook rule active for top 3 categories
        </span>
        <span className="text-[10px] text-cyber-muted underline cursor-pointer hover:text-cyber-text">View Rules</span>
      </div>
    </div>
  );
};
