import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  XCircle, 
  Search, 
  Activity, 
  Server, 
  Bot, 
  CheckCheck,
  ShieldAlert
} from 'lucide-react';

export const InvestigationProgress = ({ 
  iocValue, 
  currentStep, 
  progressPercent, 
  stepStatuses, 
  errorMessage 
}) => {
  const steps = [
    {
      id: 'investigating',
      activeText: 'Investigating IOC...',
      completedText: 'IOC Syntax & Type Auto-Detected',
      icon: Search,
      percentage: 20
    },
    {
      id: 'virustotal',
      activeText: 'Querying VirusTotal Threat Intelligence...',
      completedText: 'VirusTotal Analysis Complete',
      icon: Activity,
      percentage: 50
    },
    {
      id: 'abuseipdb',
      activeText: 'Checking AbuseIPDB Abuse Ratings...',
      completedText: 'AbuseIPDB Analysis Complete',
      icon: Server,
      percentage: 80
    },
    {
      id: 'ai_correlation',
      activeText: 'AI Correlation in Progress...',
      completedText: 'AI Threat Reasoning Complete',
      icon: Bot,
      percentage: 95
    },
    {
      id: 'completed',
      activeText: 'Finalizing Incident Investigation Report...',
      completedText: 'Investigation Completed',
      icon: CheckCheck,
      percentage: 100
    }
  ];

  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-cyber-accent/40 bg-cyber-card/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fade-in my-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-accent/20 border border-cyber-accent/40 text-cyber-accent shadow-cyber-glow">
            <Bot className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-cyber-text font-mono flex items-center gap-2">
              SOC Incident Investigation Pipeline
            </h3>
            <p className="text-xs text-cyber-muted font-mono mt-0.5">
              Target IOC: <span className="text-emerald-400 font-bold break-all">{iocValue}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert inside panel if failed */}
      {errorMessage && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-3.5 text-xs font-mono text-red-400 flex items-start gap-2.5 shadow-lg">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Pipeline Execution Notice</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const status = stepStatuses[step.id] || (idx < currentStep ? 'completed' : idx === currentStep ? 'running' : 'pending');
          const isCompleted = status === 'completed';
          const isRunning = status === 'running';
          const isError = status === 'error';
          const IconComponent = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between rounded-xl border p-3.5 transition-all duration-300 ${
                isCompleted
                  ? 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.12)] animate-fade-in'
                  : isRunning
                  ? 'border-cyber-accent bg-cyber-accent/15 shadow-[0_0_18px_rgba(6,182,212,0.2)]'
                  : isError
                  ? 'border-red-500/40 bg-red-500/15 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                  : 'border-cyber-border/40 bg-cyber-surface/30 opacity-40'
              }`}
            >
              <div className="flex items-center gap-3 font-mono text-xs">
                {/* Status Indicator Icon */}
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isRunning ? (
                    <Loader2 className="h-4 w-4 text-cyber-accent animate-spin" />
                  ) : isError ? (
                    <XCircle className="h-4 w-4 text-red-400" />
                  ) : (
                    <IconComponent className="h-4 w-4 text-cyber-muted" />
                  )}
                </div>

                {/* Step Text */}
                <span
                  className={`font-bold ${
                    isCompleted
                      ? 'text-emerald-400'
                      : isRunning
                      ? 'text-cyber-accent animate-pulse'
                      : isError
                      ? 'text-red-400'
                      : 'text-cyber-muted'
                  }`}
                >
                  {isCompleted
                    ? `✓ ${step.completedText}`
                    : isRunning
                    ? step.activeText
                    : isError
                    ? `✕ ${step.activeText} Failed`
                    : step.activeText}
                </span>
              </div>

              {/* Status Badge */}
              <div className="font-mono text-[10px] uppercase font-bold shrink-0 ml-2">
                {isCompleted && (
                  <span className="text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                    Done
                  </span>
                )}
                {isRunning && (
                  <span className="text-cyber-accent bg-cyber-accent/20 px-2 py-0.5 rounded border border-cyber-accent/40 animate-pulse">
                    Active
                  </span>
                )}
                {isError && (
                  <span className="text-red-400 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/40">
                    Failed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar & Percentage Footer */}
      <div className="pt-2">
        <div className="flex justify-between items-center text-xs font-mono text-cyber-muted mb-2">
          <span>Investigation Progress</span>
          <span className="text-cyber-accent font-bold text-sm">
            {progressPercent}%
          </span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-cyber-surface border border-cyber-border/40">
          <div
            className="h-full bg-gradient-to-r from-cyber-accent via-blue-500 to-emerald-400 transition-all duration-500 ease-out shadow-cyber-glow"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
