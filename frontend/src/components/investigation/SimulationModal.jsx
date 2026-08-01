import React, { useState, useEffect } from 'react';
import { X, Bot, CheckCircle2, Loader2, ShieldAlert, Cpu, Terminal, Zap, FileText, Lock } from 'lucide-react';
import { Badge } from '../common/Badge';

export const SimulationModal = ({ isOpen, onClose, incidentData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const steps = [
    { title: 'Log Stream Ingestion', detail: 'Parsing JSON payload, extracting event ID, timestamp & host metadata...' },
    { title: 'IOC Extraction & Normalization', detail: 'Identified 2 IPv4 addresses, 1 SHA-256 process hash, 1 obfuscated PowerShell command.' },
    { title: 'Threat Intelligence Lookup', detail: 'Querying VirusTotal API, AlienVault OTX, and internal threat graph DB...' },
    { title: 'LLM Reasoning & MITRE Mapping', detail: 'Synthesizing evidence with LLM model. Mapped to T1059.001 (Command & Scripting Interpreter) & T1003.001 (LSASS Memory).' },
    { title: 'Remediation Playbook Generation', detail: 'Synthesizing host isolation command, user credential revocation & firewall block rules.' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsFinished(false);
      return;
    }

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsFinished(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl rounded-2xl border border-cyber-border bg-cyber-card p-6 shadow-2xl overflow-hidden">
        {/* Decorative Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-accent via-purple-500 to-rose-500"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyber-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-accent/15 border border-cyber-accent/40 text-cyber-accent shadow-cyber-glow">
              <Bot className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cyber-text flex items-center gap-2">
                AI SOC Investigation Engine
                <span className="rounded-full bg-cyber-accent/20 px-2 py-0.5 text-[10px] font-mono text-cyber-accent border border-cyber-accent/30">
                  LIVE REASONING
                </span>
              </h3>
              <p className="text-xs text-cyber-muted">
                Analyzing Incident: <span className="font-mono text-cyber-text font-bold">{incidentData?.id || 'INC-2026-8901'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-cyber-border p-1.5 text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-mono text-cyber-muted mb-2">
            <span>Workflow Execution Status</span>
            <span className="text-cyber-accent font-bold">
              {Math.min(100, Math.round(((currentStep + (isFinished ? 1 : 0)) / steps.length) * 100))}% Complete
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-cyber-surface">
            <div
              className="h-full bg-gradient-to-r from-cyber-accent to-purple-500 transition-all duration-500"
              style={{ width: `${((currentStep + (isFinished ? 1 : 0)) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps Stepper */}
        <div className="mt-6 space-y-3.5 max-h-64 overflow-y-auto pr-2">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep || isFinished;
            const isCurrent = idx === currentStep && !isFinished;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3.5 rounded-xl border p-3.5 transition-all ${
                  isCurrent
                    ? 'border-cyber-accent bg-cyber-accent/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : isDone
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-cyber-border/40 bg-cyber-surface/40 opacity-50'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 text-cyber-accent animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-cyber-border text-center text-xs text-cyber-muted leading-5 font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold font-mono ${isCurrent ? 'text-cyber-accent' : isDone ? 'text-emerald-400' : 'text-cyber-muted'}`}>
                    Step {idx + 1}: {step.title}
                  </h4>
                  <p className="text-xs text-slate-300">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Finished AI Output Card */}
        {isFinished && (
          <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="h-4 w-4" /> AI Root Cause Analysis Completed (Confidence: 98%)
              </span>
              <Badge variant="critical">CRITICAL THREAT CONFIRMED</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong>Verdict:</strong> Malicious LSASS credential dumping attempt executed via Trojanized Word Macro. Immediate host isolation and Kerberos ticket revocation recommended.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg"
              >
                Apply Remediation & Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
