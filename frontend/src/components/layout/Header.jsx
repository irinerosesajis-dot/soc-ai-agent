import React, { useState, useEffect } from 'react';
import { Server, Clock, RefreshCw, Zap } from 'lucide-react';

export const Header = ({ activeTab }) => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [timeUtc, setTimeUtc] = useState('');

  // Live Clock UTC
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Health check query to FastAPI backend
  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('error');
      }
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const pageTitles = {
    'dashboard': { title: 'AI Incident Overview', desc: 'IOC analysis metrics, threat overview, and primary triage launchpad' },
    'new-investigation': { title: 'New IOC Investigation', desc: 'Step 1-4 IOC analysis engine (IP, Domain, URL, Hash)' },
    'history': { title: 'Investigation History', desc: 'Clean audit repository of previous IOC investigations and AI reports' },
    'settings': { title: 'Agent Settings', desc: 'Manage VirusTotal & AbuseIPDB API credentials, theme, and project metadata' }
  };

  const currentInfo = pageTitles[activeTab] || { title: 'AI SOC Agent', desc: 'IOC Investigation Engine' };

  return (
    <header className="flex h-16 items-center justify-between border-b border-cyber-border bg-cyber-surface/60 px-6 backdrop-blur-md">
      {/* Title & Description */}
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cyber-text flex items-center gap-2">
          {currentInfo.title}
        </h1>
        <p className="text-xs text-cyber-muted hidden md:block">
          {currentInfo.desc}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">

        {/* Backend Status Indicator */}
        <div 
          onClick={checkBackendHealth}
          className="cursor-pointer flex items-center gap-2 rounded-xl border border-cyber-border bg-cyber-card/60 px-3 py-1.5 text-xs font-mono transition-colors hover:border-cyber-accent"
          title="Click to re-check FastAPI Backend Connection"
        >
          <Server className="h-3.5 w-3.5 text-cyber-muted" />
          <span className="text-cyber-muted hidden sm:inline">Backend:</span>
          {backendStatus === 'checking' && (
            <span className="flex items-center gap-1 text-amber-400">
              <RefreshCw className="h-3 w-3 animate-spin" /> CHECKING
            </span>
          )}
          {backendStatus === 'online' && (
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> FASTAPI ONLINE
            </span>
          )}
          {backendStatus === 'offline' && (
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-rose-400"></span> SCAFFOLD READY
            </span>
          )}
        </div>

        {/* UTC Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-cyber-muted border-r border-cyber-border pr-4">
          <Clock className="h-3.5 w-3.5 text-cyber-accent" />
          <span>{timeUtc || 'UTC TIME'}</span>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3 border-l border-cyber-border pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 font-mono text-xs font-bold text-white shadow-cyber-glow">
            AI
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-cyber-text">AI Agent</span>
            <span className="text-[10px] text-cyber-accent font-mono">Hackathon MVP</span>
          </div>
        </div>
      </div>
    </header>
  );
};
