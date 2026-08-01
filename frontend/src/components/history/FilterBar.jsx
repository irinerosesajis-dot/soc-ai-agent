import React from 'react';
import { Search, Filter, RefreshCw, Download } from 'lucide-react';

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  severityFilter,
  setSeverityFilter
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 rounded-xl border border-cyber-border bg-cyber-card/80 p-4 backdrop-blur-md">
      {/* Search Input */}
      <div className="relative w-full lg:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ID, Title, IP, Asset or Hash..."
          className="w-full rounded-xl border border-cyber-border bg-cyber-surface py-2 pl-9 pr-4 text-xs text-cyber-text placeholder-cyber-muted focus:border-cyber-accent focus:outline-none"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
        {/* Status Pills */}
        <div className="flex items-center gap-1 rounded-xl border border-cyber-border bg-cyber-surface p-1 text-xs">
          <Filter className="h-3.5 w-3.5 text-cyber-muted ml-1.5" />
          {['ALL', 'Investigating', 'Containment Active', 'Resolved', 'False Positive'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                statusFilter === st
                  ? 'bg-cyber-accent text-cyber-bg font-bold shadow-sm'
                  : 'text-cyber-muted hover:text-cyber-text'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Severity Dropdown */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-xl border border-cyber-border bg-cyber-surface px-3 py-2 text-xs text-cyber-text focus:border-cyber-accent focus:outline-none font-mono"
        >
          <option value="ALL">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Export CSV Button */}
        <button
          onClick={() => alert("Exporting investigation log CSV report...")}
          className="flex items-center gap-1.5 rounded-xl border border-cyber-border bg-cyber-surface px-3 py-2 text-xs font-medium text-cyber-text hover:border-cyber-accent transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-cyber-accent" /> Export CSV
        </button>
      </div>
    </div>
  );
};
