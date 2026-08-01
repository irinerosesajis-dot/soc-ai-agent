import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md' }) => {
  const variantStyles = {
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    medium: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border transition-all duration-200 ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>
      {children}
    </span>
  );
};

export const getSeverityVariant = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    default:
      return 'neutral';
  }
};

export const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'investigating':
      return 'high';
    case 'containment active':
      return 'critical';
    case 'resolved':
      return 'success';
    case 'false positive':
      return 'neutral';
    case 'escalated':
      return 'purple';
    default:
      return 'neutral';
  }
};
