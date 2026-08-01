import React from 'react';
import { Badge, getSeverityVariant } from '../common/Badge';
import { Eye, Terminal, Globe, FileCode, Link as LinkIcon, CheckCircle } from 'lucide-react';

export const HistoryTable = ({ investigations, onSelectRecord }) => {
  const getIocIcon = (type) => {
    switch (type) {
      case 'IP Address':
        return <Globe className="h-4 w-4 text-cyber-accent" />;
      case 'Domain':
        return <Globe className="h-4 w-4 text-purple-400" />;
      case 'URL':
        return <LinkIcon className="h-4 w-4 text-amber-400" />;
      case 'File Hash':
        return <FileCode className="h-4 w-4 text-rose-400" />;
      default:
        return <Globe className="h-4 w-4 text-cyber-muted" />;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-cyber-border bg-cyber-card/80 backdrop-blur-md shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-cyber-border bg-cyber-surface/80 font-mono uppercase text-cyber-muted">
            <tr>
              <th className="px-4 py-3.5">IOC Type</th>
              <th className="px-4 py-3.5">IOC Value</th>
              <th className="px-4 py-3.5">Risk Level</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40 text-cyber-text">
            {investigations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-cyber-muted">
                  No matching investigation history records found.
                </td>
              </tr>
            ) : (
              investigations.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-cyber-surface/60 cursor-pointer"
                  onClick={() => onSelectRecord(item)}
                >
                  <td className="px-4 py-3.5 font-mono font-semibold text-cyber-text flex items-center gap-2">
                    {getIocIcon(item.iocType)}
                    <span>{item.iocType}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-emerald-400 font-bold max-w-xs truncate">
                    {item.iocValue}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={getSeverityVariant(item.riskLevel)}>
                      {item.riskLevel}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 font-mono text-emerald-400 text-xs">
                      <CheckCircle className="h-3.5 w-3.5" /> {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-cyber-muted whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectRecord(item)}
                      className="flex items-center gap-1 rounded-lg border border-cyber-border bg-cyber-card px-3 py-1.5 text-xs font-mono text-cyber-text hover:border-cyber-accent hover:text-cyber-accent transition-colors ml-auto"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between border-t border-cyber-border/60 bg-cyber-surface/40 px-4 py-3 text-xs text-cyber-muted font-mono">
        <span>Total Records: {investigations.length}</span>
        <span>IOC Audit Vault v1.0</span>
      </div>
    </div>
  );
};
