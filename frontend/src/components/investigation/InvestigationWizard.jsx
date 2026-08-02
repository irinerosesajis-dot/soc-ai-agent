import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Cpu
} from 'lucide-react';
import { InvestigationResults } from './InvestigationResults';
import { investigateIOC } from '../../services/api';

export const InvestigationWizard = ({ onRunTriage }) => {
  const [iocValue, setIocValue] = useState('198.51.100.44');

  // Execution flow states: 'idle' | 'simulating' | 'results'
  const [flowState, setFlowState] = useState('idle');
  const [currentSimStep, setCurrentSimStep] = useState(0);
  const [activeResult, setActiveResult] = useState(null);
  const [error, setError] = useState(null);

  const simSteps = [
    { title: 'Detecting IOC type', detail: `Auto-detecting syntax and category for target IOC...` },
    { title: 'Querying VirusTotal', detail: `Requesting reputation, detection engines & malicious flags for ${iocValue}...` },
    { title: 'Querying AbuseIPDB', detail: 'Checking report frequency, CIDR block owner, and threat confidence rating...' },
    { title: 'Correlating threat intelligence', detail: 'Cross-referencing IOC against internal attack graph and MITRE ATT&CK heuristics...' },
    { title: 'AI reasoning in progress', detail: 'Synthesizing evidence payload with AI SOC Reasoning Engine...' },
    { title: 'Generating incident report', detail: 'Formatting findings, assigning risk level & assembling playbook actions...' }
  ];

  const presets = [
    { value: '198.51.100.44', label: 'Sample C2 IP' },
    { value: 'google.com', label: 'Sample Domain' },
    { value: 'c2-exfil-node.ru', label: 'Rogue Exfil Domain' },
    { value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', label: 'Mimikatz Hash' }
  ];

  const handleStartInvestigation = async (e) => {
    if (e) e.preventDefault();
    if (!iocValue.trim()) return;

    setError(null);
    setFlowState('simulating');
    setCurrentSimStep(0);

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < simSteps.length) {
        setCurrentSimStep(stepIndex);
      }
    }, 500);

    try {
      const data = await investigateIOC(iocValue.trim());
      clearInterval(interval);
      setCurrentSimStep(simSteps.length - 1);

      const generatedResult = {
        id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        ioc: data.ioc || iocValue,
        ioc_type: data.ioc_type || 'Unknown',
        risk_level: data.risk_level || 'Low',
        virustotal: data.virustotal,
        abuseipdb: data.abuseipdb,
        date: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      };

      setActiveResult(generatedResult);
      setFlowState('results');
      if (onRunTriage) onRunTriage(generatedResult);
    } catch (err) {
      clearInterval(interval);
      console.error('Investigation failed:', err);
      const errorMessage = err.response?.data?.detail 
        || err.message 
        || 'Failed to communicate with the backend server. Please verify the FastAPI backend is running at http://127.0.0.1:8000.';
      setError(errorMessage);
      setFlowState('idle');
    }
  };

  const handleSelectPreset = (p) => {
    setIocValue(p.value);
    setError(null);
  };

  if (flowState === 'results') {
    return (
      <InvestigationResults
        resultData={activeResult}
        onReset={() => {
          setFlowState('idle');
          setError(null);
          setActiveResult(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Ingest Banner */}
      <div className="rounded-2xl border border-cyber-accent/30 bg-gradient-to-r from-cyber-card via-cyber-surface to-cyber-bg p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-cyber-accent/10 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyber-accent text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> Primary AI Incident Triage Engine
            </div>
            <h2 className="mt-1 text-xl font-bold text-cyber-text">
              Investigate Indicator of Compromise (IOC)
            </h2>
            <p className="mt-1 text-xs text-cyber-muted max-w-2xl">
              Enter any IOC target value (IP, Domain, URL, or File Hash). The system automatically detects the IOC type and launches VirusTotal correlation and AI threat reasoning.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="rounded-xl border border-cyber-border bg-cyber-card/80 px-3 py-1.5 text-xs font-mono text-cyber-text hover:border-cyber-accent hover:text-cyber-accent transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-5 backdrop-blur-md shadow-2xl flex items-start gap-4 animate-fade-in">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-red-400 font-mono">Backend Request Failed</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Main Wizard Form */}
      {flowState === 'idle' && (
        <form onSubmit={handleStartInvestigation} className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md space-y-6 shadow-2xl">
          {/* Enter IOC Value Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-cyber-text uppercase font-mono flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyber-accent text-cyber-bg text-[11px]">1</span>
              Enter Indicator of Compromise (IOC)
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-muted" />
              <input
                type="text"
                value={iocValue}
                onChange={(e) => {
                  setIocValue(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. 8.8.8.8, google.com, https://example.com/login, MD5/SHA1/SHA256 hash..."
                className="w-full rounded-xl border border-cyber-border bg-cyber-bg py-3.5 pl-10 pr-4 text-xs font-mono text-emerald-400 placeholder-cyber-muted focus:border-cyber-accent focus:outline-none leading-relaxed shadow-inner"
                required
              />
            </div>
          </div>

          {/* Start Investigation Trigger */}
          <div className="pt-2 border-t border-cyber-border/60 flex justify-end">
            <button
              type="submit"
              className="flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyber-accent to-blue-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-cyber-glow hover:opacity-95 transition-all font-mono"
            >
              <Zap className="h-4 w-4 fill-current" /> Start AI Investigation
            </button>
          </div>
        </form>
      )}

      {/* Progress Timeline Simulation Modal */}
      {flowState === 'simulating' && (
        <div className="rounded-2xl border border-cyber-accent/40 bg-cyber-card/90 p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-cyber-border/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-accent/20 text-cyber-accent shadow-cyber-glow">
                <Cpu className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-cyber-text font-mono flex items-center gap-2">
                  AI Investigation Pipeline Active
                  <span className="rounded-full bg-cyber-accent/20 px-2 py-0.5 text-[10px] text-cyber-accent font-bold">
                    STEP {currentSimStep + 1} OF 6
                  </span>
                </h3>
                <p className="text-xs text-cyber-muted">
                  Target: <span className="font-mono text-cyber-text font-bold">{iocValue}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono text-cyber-muted mb-2">
              <span>Pipeline Analysis Progress</span>
              <span className="text-cyber-accent font-bold">
                {Math.round(((currentSimStep + 1) / simSteps.length) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-cyber-surface">
              <div
                className="h-full bg-gradient-to-r from-cyber-accent to-purple-500 transition-all duration-500"
                style={{ width: `${((currentSimStep + 1) / simSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-3 pt-2">
            {simSteps.map((step, idx) => {
              const isDone = idx < currentSimStep;
              const isCurrent = idx === currentSimStep;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 rounded-xl border p-3.5 transition-all ${
                    isCurrent
                      ? 'border-cyber-accent bg-cyber-accent/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : isDone
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-cyber-border/40 bg-cyber-surface/30 opacity-40'
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

                  <div>
                    <h4 className={`text-xs font-bold font-mono ${isCurrent ? 'text-cyber-accent' : isDone ? 'text-emerald-400' : 'text-cyber-muted'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
