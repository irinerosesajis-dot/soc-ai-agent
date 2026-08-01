import React, { useState } from 'react';
import { HistoryTable } from '../components/history/HistoryTable';
import { IncidentDetailModal } from '../components/history/IncidentDetailModal';
import { History, Search, Filter } from 'lucide-react';

export const InvestigationHistoryPage = ({ investigations }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filtered = investigations.filter((item) =>
    item.iocValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.iocType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.riskLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-cyber-text flex items-center gap-2">
            <History className="h-5 w-5 text-cyber-accent" /> IOC Investigation History
          </h2>
          <p className="text-xs text-cyber-muted">
            Clean audit repository of past IOC investigations and AI threat correlation results.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IOC value, type or risk..."
            className="w-full rounded-xl border border-cyber-border bg-cyber-surface py-2 pl-9 pr-4 text-xs text-cyber-text placeholder-cyber-muted focus:border-cyber-accent focus:outline-none"
          />
        </div>
      </div>

      {/* History Table */}
      <HistoryTable
        investigations={filtered}
        onSelectRecord={(rec) => setSelectedRecord(rec)}
      />

      {/* Details Modal */}
      <IncidentDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
