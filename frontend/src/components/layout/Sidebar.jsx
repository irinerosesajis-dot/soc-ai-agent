import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings, 
  Terminal,
  Activity,
  Cpu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-investigation', label: 'New Investigation', icon: PlusCircle, highlight: true },
    { id: 'history', label: 'Investigation History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-cyber-border bg-cyber-surface/90 backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-cyber-border px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-accent/20 to-purple-600/20 border border-cyber-accent/40 shadow-cyber-glow">
            <ShieldAlert className="h-5 w-5 text-cyber-accent" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-accent"></span>
            </span>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider text-cyber-text uppercase font-mono">
                AI SOC <span className="text-cyber-accent">Agent</span>
              </span>
              <span className="text-[10px] text-cyber-muted tracking-widest uppercase">
                SecOps Engine v1.0
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-cyber-border text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyber-accent/20 to-transparent text-cyber-accent border-l-4 border-cyber-accent shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-cyber-muted hover:bg-cyber-card/60 hover:text-cyber-text'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyber-accent' : 'text-cyber-muted'}`} />
              
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {item.highlight && !isCollapsed && (
                <span className="ml-auto rounded-full bg-cyber-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyber-accent border border-cyber-accent/30">
                  AI Live
                </span>
              )}

              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 hidden rounded-md border border-cyber-border bg-cyber-card px-2.5 py-1 text-xs font-semibold text-cyber-text shadow-xl group-hover:block z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="border-t border-cyber-border p-3">
        {!isCollapsed ? (
          <div className="rounded-xl border border-cyber-border/60 bg-cyber-card/40 p-3 text-xs">
            <div className="flex items-center justify-between text-cyber-muted">
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyber-accent" /> LLM Status
              </span>
              <span className="font-mono text-emerald-400 text-[11px]">READY</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-cyber-muted">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyber-purple" /> Defense Level
              </span>
              <span className="font-mono text-cyan-400 text-[11px]">ACTIVE</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="System Ready">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping"></div>
          </div>
        )}
      </div>
    </aside>
  );
};
