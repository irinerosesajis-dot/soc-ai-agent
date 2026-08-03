import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { InvestigationResults } from './InvestigationResults';
import { InvestigationProgress } from './InvestigationProgress';
import { investigateIOC } from '../../services/api';

export const InvestigationWizard = ({ onRunTriage }) => {
  const [iocValue, setIocValue] = useState('198.51.100.44');

  // Execution flow states: 'idle' | 'simulating' | 'results'
  const [flowState, setFlowState] = useState('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(20);
  const [stepStatuses, setStepStatuses] = useState({
    investigating: 'running',
    virustotal: 'pending',
    abuseipdb: 'pending',
    ai_correlation: 'pending',
    completed: 'pending'
  });

  const [activeResult, setActiveResult] = useState(null);
  const [error, setError] = useState(null);

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
    setCurrentStep(0);
    setProgressPercent(20);
    setStepStatuses({
      investigating: 'running',
      virustotal: 'pending',
      abuseipdb: 'pending',
      ai_correlation: 'pending',
      completed: 'pending'
    });

    // Start step progression animation while backend API call runs
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      if (stepCount === 1) {
        setCurrentStep(1);
        setProgressPercent(50);
        setStepStatuses(prev => ({
          ...prev,
          investigating: 'completed',
          virustotal: 'running'
        }));
      } else if (stepCount === 2) {
        setCurrentStep(2);
        setProgressPercent(80);
        setStepStatuses(prev => ({
          ...prev,
          virustotal: 'completed',
          abuseipdb: 'running'
        }));
      } else if (stepCount === 3) {
        setCurrentStep(3);
        setProgressPercent(95);
        setStepStatuses(prev => ({
          ...prev,
          abuseipdb: 'completed',
          ai_correlation: 'running'
        }));
      }
    }, 600);

    try {
      const data = await investigateIOC(iocValue.trim());
      console.log("Investigation API response:", data);
      console.log("AI Summary:", data.ai_summary);
      clearInterval(interval);


      // Complete all steps
      setCurrentStep(4);
      setProgressPercent(100);
      setStepStatuses({
        investigating: 'completed',
        virustotal: 'completed',
        abuseipdb: 'completed',
        ai_correlation: 'completed',
        completed: 'completed'
      });

      const generatedResult = {
        id: data.id || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        ioc: data.ioc || iocValue,
        ioc_type: data.ioc_type || 'Unknown',
        risk_level: data.risk_level || 'Low',
        virustotal: data.virustotal,
        abuseipdb: data.abuseipdb,
        ai_summary: data.ai_summary || data.summary,
        summary: data.summary || data.ai_summary || data.gemini_summary || data.ai_investigation_summary,
        date: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      };


      // Brief completion delay for smooth UX transition
      setTimeout(() => {
        setActiveResult(generatedResult);
        setFlowState('results');
        if (onRunTriage) onRunTriage(generatedResult);
      }, 500);

    } catch (err) {
      clearInterval(interval);
      console.error('Investigation failed:', err);
      const errorMessage = err.response?.data?.detail 
        || err.message 
        || 'Failed to communicate with backend server at http://127.0.0.1:8000.';
      
      setError(errorMessage);
      setStepStatuses(prev => {
        const updated = { ...prev };
        if (updated.ai_correlation === 'running') updated.ai_correlation = 'error';
        else if (updated.abuseipdb === 'running') updated.abuseipdb = 'error';
        else if (updated.virustotal === 'running') updated.virustotal = 'error';
        else updated.investigating = 'error';
        return updated;
      });
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

      {/* Error Banner when idle */}
      {error && flowState === 'idle' && (
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

      {/* Animated Investigation Progress Panel */}
      {flowState === 'simulating' && (
        <InvestigationProgress
          iocValue={iocValue}
          currentStep={currentStep}
          progressPercent={progressPercent}
          stepStatuses={stepStatuses}
          errorMessage={error}
        />
      )}
    </div>
  );
};

