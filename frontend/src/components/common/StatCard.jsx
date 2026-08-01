import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'cyan' }) => {
  const colorMap = {
    cyan: {
      border: 'hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    },
    rose: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    },
    purple: {
      border: 'hover:border-purple-500/50',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]',
    },
  };

  const currentTheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-cyber-card/80 p-5 backdrop-blur-md border border-cyber-border transition-all duration-300 ${currentTheme.border} ${currentTheme.glow}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-cyber-muted">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-cyber-text font-mono">{value}</h3>
        </div>
        {Icon && (
          <div className={`rounded-xl border p-3 ${currentTheme.iconBg}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-cyber-border/40 pt-3 text-xs text-cyber-muted">
        <span>{subtitle}</span>
        {trend && (
          <span className={`font-semibold ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
