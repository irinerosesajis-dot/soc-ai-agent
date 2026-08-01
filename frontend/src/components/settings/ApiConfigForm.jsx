import React, { useState } from 'react';
import { Key, Eye, EyeOff, Save, CheckCircle2, ShieldCheck, Sun, Moon, Info } from 'lucide-react';

export const ApiConfigForm = () => {
  const [vtApiKey, setVtApiKey] = useState('vt_live_94012938491029384019238');
  const [abuseApiKey, setAbuseApiKey] = useState('abuse_live_771823940192837401');
  const [showVt, setShowVt] = useState(false);
  const [showAbuse, setShowAbuse] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <form onSubmit={handleSave} className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyber-accent" /> Threat Intelligence API Keys
            </h3>
            <p className="text-xs text-cyber-muted">Configure VirusTotal and AbuseIPDB API keys for IOC correlation</p>
          </div>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono animate-fade-in">
              <CheckCircle2 className="h-4 w-4" /> SETTINGS SAVED
            </span>
          )}
        </div>

        {/* VirusTotal API Key */}
        <div>
          <label className="text-xs font-semibold text-cyber-muted uppercase font-mono flex items-center justify-between">
            <span>VirusTotal API Key</span>
            <span className="text-[10px] text-cyber-accent">v3 REST API</span>
          </label>
          <div className="relative mt-1.5">
            <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-muted" />
            <input
              type={showVt ? 'text' : 'password'}
              value={vtApiKey}
              onChange={(e) => setVtApiKey(e.target.value)}
              className="w-full rounded-xl border border-cyber-border bg-cyber-surface py-2 pl-9 pr-10 text-xs font-mono text-cyber-text focus:border-cyber-accent focus:outline-none"
              placeholder="Enter VirusTotal API Key..."
            />
            <button
              type="button"
              onClick={() => setShowVt(!showVt)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-text"
            >
              {showVt ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* AbuseIPDB API Key */}
        <div>
          <label className="text-xs font-semibold text-cyber-muted uppercase font-mono flex items-center justify-between">
            <span>AbuseIPDB API Key</span>
            <span className="text-[10px] text-cyber-accent">v2 REST API</span>
          </label>
          <div className="relative mt-1.5">
            <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-muted" />
            <input
              type={showAbuse ? 'text' : 'password'}
              value={abuseApiKey}
              onChange={(e) => setAbuseApiKey(e.target.value)}
              className="w-full rounded-xl border border-cyber-border bg-cyber-surface py-2 pl-9 pr-10 text-xs font-mono text-cyber-text focus:border-cyber-accent focus:outline-none"
              placeholder="Enter AbuseIPDB API Key..."
            />
            <button
              type="button"
              onClick={() => setShowAbuse(!showAbuse)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-text"
            >
              {showAbuse ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Theme (Dark / Light) */}
        <div className="pt-2 border-t border-cyber-border/60">
          <label className="text-xs font-semibold text-cyber-muted uppercase font-mono block mb-2">
            Application Theme Mode
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-mono transition-all ${
                theme === 'dark'
                  ? 'border-cyber-accent bg-cyber-accent/15 text-cyber-accent font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'border-cyber-border bg-cyber-surface text-cyber-muted'
              }`}
            >
              <Moon className="h-4 w-4" /> Dark Cyber Mode (Active)
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-mono transition-all ${
                theme === 'light'
                  ? 'border-cyber-accent bg-cyber-accent/15 text-cyber-accent font-bold'
                  : 'border-cyber-border bg-cyber-surface text-cyber-muted'
              }`}
            >
              <Sun className="h-4 w-4" /> Light Mode
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-cyber-accent px-5 py-2.5 text-xs font-bold text-cyber-bg hover:opacity-90 transition-all shadow-cyber-glow font-mono"
          >
            <Save className="h-4 w-4" /> Save API Keys & Preferences
          </button>
        </div>
      </form>

      {/* About Project Section */}
      <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-3 shadow-xl">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3">
          <Info className="h-4 w-4 text-cyber-accent" /> About Project: AI SOC Incident Investigation Agent
        </h3>
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            <strong>AI SOC Incident Investigation Agent</strong> is a Hackathon MVP prototype designed for rapid, automated triage of Indicators of Compromise (IPs, Domains, URLs, File Hashes).
          </p>
          <div className="rounded-lg border border-cyber-border bg-cyber-surface/60 p-3 font-mono text-[11px] space-y-1 text-cyber-muted">
            <div>• <strong>Frontend:</strong> React 18 + Vite + Tailwind CSS</div>
            <div>• <strong>Backend Scaffold:</strong> Python FastAPI (GET / & GET /health)</div>
            <div>• <strong>Primary Workflow:</strong> 4-step IOC Investigation pipeline simulation</div>
            <div>• <strong>Version:</strong> Hackathon MVP v1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};
