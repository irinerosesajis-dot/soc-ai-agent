import React from 'react';
import { Copy, Terminal, Check } from 'lucide-react';

export const LogViewer = ({ title = "Raw Alert Payload", logs }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-cyber-border bg-cyber-bg font-mono text-xs shadow-2xl">
      <div className="flex items-center justify-between border-b border-cyber-border bg-cyber-surface/90 px-4 py-2.5">
        <span className="flex items-center gap-2 text-cyber-accent font-semibold">
          <Terminal className="h-4 w-4" /> {title}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded border border-cyber-border px-2 py-1 text-[11px] text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto p-4 leading-relaxed text-slate-300">
        <pre className="whitespace-pre-wrap break-all font-mono">{logs}</pre>
      </div>
    </div>
  );
};
