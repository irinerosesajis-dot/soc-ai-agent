import React, { useState } from 'react';
import { Sliders, Shield, Zap, Lock, RefreshCw } from 'lucide-react';

export const SocRulesForm = () => {
  const [autoIsolate, setAutoIsolate] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [rateLimitThreshold, setRateLimitThreshold] = useState(500);

  return (
    <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-5">
      <div className="border-b border-cyber-border/60 pb-3">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyber-accent" /> SOC Automation & Active Containment Rules
        </h3>
        <p className="text-xs text-cyber-muted">Define thresholds for autonomous agent containment triggers</p>
      </div>

      <div className="space-y-4">
        {/* Toggle Auto Containment */}
        <div className="flex items-center justify-between rounded-xl border border-cyber-border bg-cyber-surface/60 p-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-cyber-text flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyber-accent" /> Automatic Host Isolation (Zero Touch)
            </h4>
            <p className="text-[11px] text-cyber-muted">
              Automatically issue EDR network isolation API call when AI confidence score exceeds threshold
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoIsolate}
            onChange={(e) => setAutoIsolate(e.target.checked)}
            className="h-4 w-4 rounded accent-cyber-accent"
          />
        </div>

        {/* Confidence Threshold Slider */}
        <div className="rounded-xl border border-cyber-border bg-cyber-surface/60 p-4 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-cyber-text font-bold">Minimum AI Verdict Confidence Threshold</span>
            <span className="text-cyber-accent font-bold">{confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min="70"
            max="99"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full accent-cyber-accent cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-cyber-muted font-mono">
            <span>70% (Aggressive Triage)</span>
            <span>90% (Recommended)</span>
            <span>99% (Strict Proof Only)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
