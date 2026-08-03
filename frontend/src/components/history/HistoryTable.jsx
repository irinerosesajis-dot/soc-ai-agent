import React from 'react';
import { Badge, getSeverityVariant } from '../common/Badge';
import { Eye, Trash2, Globe, FileCode, Link as LinkIcon } from 'lucide-react';

export const HistoryTable = ({ investigations, onSelectRecord, onDeleteRecord }) => {
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
              <th className="px-4 py-3.5">IOC</th>
              <th className="px-4 py-3.5">IOC Type</th>
              <th className="px-4 py-3.5">Risk Level</th>
              <th className="px-4 py-3.5">Date & Time</th>
              <th className="px-4 py-3.5 text-center">View</th>
              <th className="px-4 py-3.5 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40 text-cyber-text">
            {investigations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-cyber-muted font-mono">
                  No matching investigation history records found.
                </td>
              </tr>
            ) : (
              investigations.map((item) => {
                const ioc = item.ioc || item.iocValue || 'Unknown';
                const iocType = item.ioc_type || item.iocType || 'Unknown';
                const riskLevel = item.risk_level || item.riskLevel || 'Low';
                const dateStr = item.date || item.timestamp || 'N/A';

                return (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-cyber-surface/60 font-mono"
                  >
                    <td className="px-4 py-3.5 font-bold text-emerald-400 max-w-xs truncate">
                      {ioc}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-cyber-text flex items-center gap-2">
                      {getIocIcon(iocType)}
                      <span>{iocType}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={getSeverityVariant(riskLevel)}>
                        {riskLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-cyber-muted whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectRecord(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyber-border bg-cyber-surface px-3 py-1.5 text-xs text-cyber-text hover:border-cyber-accent hover:text-cyber-accent transition-colors"
                        title="View Full Investigation Cards"
                      >
                        <Eye className="h-3.5 w-3.5 text-cyber-accent" /> View
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => onDeleteRecord && onDeleteRecord(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:border-red-500 hover:bg-red-500/20 transition-colors"
                        title="Delete Investigation Record"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between border-t border-cyber-border/60 bg-cyber-surface/40 px-4 py-3 text-xs text-cyber-muted font-mono">
        <span>Total Saved Records: {investigations.length}</span>
        <span>IOC Audit Repository v1.0</span>
      </div>
    </div>
  );
};

