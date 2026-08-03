import React, { useState, useEffect } from 'react';
import { HistoryTable } from '../components/history/HistoryTable';
import { InvestigationResults } from '../components/investigation/InvestigationResults';
import { getHistory, getHistoryById, deleteHistoryRecord } from '../services/api';
import { History, Search, Filter, RefreshCw, Loader2 } from 'lucide-react';

export const InvestigationHistoryPage = ({ investigations: initialPropInvestigations }) => {
  const [historyList, setHistoryList] = useState(initialPropInvestigations || []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const records = await getHistory();
      if (Array.isArray(records)) {
        setHistoryList(records);
      }
    } catch (err) {
      console.error('Error fetching history records from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSelectRecord = async (item) => {
    if (item.virustotal && item.ai_summary) {
      setSelectedRecord(item);
      return;
    }
    setLoading(true);
    try {
      const fullRecord = await getHistoryById(item.id);
      setSelectedRecord(fullRecord || item);
    } catch (err) {
      console.error('Error fetching full history record by ID:', err);
      setSelectedRecord(item);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investigation record?')) {
      return;
    }
    try {
      await deleteHistoryRecord(id);
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord(null);
      }
    } catch (err) {
      console.error('Failed to delete history record:', err);
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filtered = historyList.filter((item) => {
    const iocVal = (item.ioc || item.iocValue || '').toLowerCase();
    const iocType = (item.ioc_type || item.iocType || '').toLowerCase();
    const riskLevel = (item.risk_level || item.riskLevel || '').toLowerCase();
    
    const matchesSearch = iocVal.includes(searchQuery.toLowerCase()) || 
                          iocType.includes(searchQuery.toLowerCase()) || 
                          riskLevel.includes(searchQuery.toLowerCase());
    
    const matchesRisk = riskFilter === 'All' || riskLevel === riskFilter.toLowerCase();

    return matchesSearch && matchesRisk;
  });

  if (selectedRecord) {
    return (
      <InvestigationResults
        resultData={selectedRecord}
        onReset={() => setSelectedRecord(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 font-mono">
            <History className="h-5 w-5 text-cyber-accent" /> IOC Investigation History
          </h2>
          <p className="text-xs text-cyber-muted font-mono mt-0.5">
            Audit repository of past IOC investigations saved automatically in MongoDB.
          </p>
        </div>

        {/* Search & Risk Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Risk Level Filter Dropdown */}
          <div className="relative">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="appearance-none rounded-xl border border-cyber-border bg-cyber-surface py-2 pl-3 pr-8 text-xs font-mono text-cyber-text focus:border-cyber-accent focus:outline-none cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cyber-muted pointer-events-none" />
          </div>

          {/* Search by IOC Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cyber-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by IOC target value..."
              className="w-full rounded-xl border border-cyber-border bg-cyber-surface py-2 pl-9 pr-4 text-xs font-mono text-cyber-text placeholder-cyber-muted focus:border-cyber-accent focus:outline-none"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadHistory}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyber-border bg-cyber-surface text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
            title="Refresh History Records"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-cyber-accent" /> : <RefreshCw className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* History Table */}
      <HistoryTable
        investigations={filtered}
        onSelectRecord={handleSelectRecord}
        onDeleteRecord={handleDelete}
      />
    </div>
  );
};


