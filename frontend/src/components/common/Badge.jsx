import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md' }) => {
  const variantStyles = {
    critical: 'bg-red-500/15 text-red-400 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.25)]',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.25)]',
    medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.25)]',
    low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/40 shadow-[0_0_10px_rgba(139,92,246,0.25)]',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all duration-200 ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size]}`}
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
