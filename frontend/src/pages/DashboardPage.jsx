import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Zap, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Eye, 
  RefreshCw, 
  Loader2, 
  AlertOctagon, 
  Layers, 
  Calendar,
  Globe,
  FileCode,
  Link as LinkIcon,
  BarChart2,
  PieChart as PieIcon,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { Badge, getSeverityVariant } from '../components/common/Badge';
import { InvestigationResults } from '../components/investigation/InvestigationResults';
import { getDashboardStats, getHistoryById } from '../services/api';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area 
} from 'recharts';

export const DashboardPage = ({ onNavigateNew }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to connect to backend service. Please verify FastAPI backend at http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
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

  if (selectedRecord) {
    return (
      <InvestigationResults
        resultData={selectedRecord}
        onReset={() => setSelectedRecord(null)}
      />
    );
  }

  // Summary Metrics Data
  const totalCount = stats?.total_investigations ?? 0;
  const todayCount = stats?.today_investigations ?? 0;
  const riskDist = stats?.risk_distribution || { low: 0, medium: 0, high: 0, critical: 0 };
  const typeDist = stats?.type_distribution || { ip_address: 0, domain: 0, url: 0, file_hash: 0, other: 0 };
  const trendData = stats?.investigations_over_time || [];
  const recentList = stats?.recent_investigations || [];

  // Chart Data Arrays
  const pieData = [
    { name: 'Low Risk', value: riskDist.low, color: '#10B981' },
    { name: 'Medium Risk', value: riskDist.medium, color: '#F59E0B' },
    { name: 'High Risk', value: riskDist.high, color: '#F97316' },
    { name: 'Critical Risk', value: riskDist.critical, color: '#F43F5E' },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'IP Address', count: typeDist.ip_address, fill: '#06B6D4' },
    { name: 'Domain', count: typeDist.domain, fill: '#A855F7' },
    { name: 'URL', count: typeDist.url, fill: '#F59E0B' },
    { name: 'File Hash', count: typeDist.file_hash, fill: '#F43F5E' },
  ];

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
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-cyber-accent/30 bg-gradient-to-r from-cyber-card via-cyber-surface to-cyber-bg p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-cyber-accent/10 blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyber-accent/20 border border-cyber-accent/40 text-cyber-accent shadow-cyber-glow">
            <Zap className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyber-accent uppercase tracking-wider">
              <span>AI SOC DASHBOARD</span> • <span>REAL-TIME THREAT METRICS</span>
            </div>
            <h2 className="text-xl font-bold text-cyber-text">
              SOC Threat Intelligence Overview
            </h2>
            <p className="text-xs text-cyber-muted mt-0.5 max-w-2xl">
              Live metrics and risk analytics computed directly from stored MongoDB investigation history.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchStats}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyber-border bg-cyber-surface text-cyber-muted hover:border-cyber-accent hover:text-cyber-text transition-colors"
            title="Refresh Dashboard Statistics"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-cyber-accent" /> : <RefreshCw className="h-4 w-4" />}
          </button>
          <button
            onClick={onNavigateNew}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-accent to-blue-600 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-cyber-glow hover:opacity-95 transition-all font-mono"
          >
            <PlusCircle className="h-4 w-4" /> Start New IOC Investigation
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-5 backdrop-blur-md shadow-2xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-400 font-mono">Dashboard API Error</h4>
              <p className="text-xs text-slate-300 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-mono text-red-400 hover:bg-red-500/20"
          >
            Retry
          </button>
        </div>
      )}

      {/* 6 Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Investigations */}
        <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-4 backdrop-blur-md shadow-lg space-y-1">
          <div className="flex items-center justify-between text-cyber-muted text-[11px] font-mono">
            <span>Total</span>
            <Activity className="h-4 w-4 text-cyber-accent" />
          </div>
          <span className="text-2xl font-bold font-mono text-cyber-text block">{totalCount}</span>
          <span className="text-[10px] font-mono text-cyber-muted block">All Saved IOCs</span>
        </div>

        {/* Today's Investigations */}
        <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-4 backdrop-blur-md shadow-lg space-y-1">
          <div className="flex items-center justify-between text-cyber-muted text-[11px] font-mono">
            <span>Today</span>
            <Calendar className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-blue-400 block">{todayCount}</span>
          <span className="text-[10px] font-mono text-cyber-muted block">Last 24 Hours</span>
        </div>

        {/* Low Risk */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-emerald-400 text-[11px] font-mono">
            <span>Low Risk</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-400 block">{riskDist.low}</span>
          <span className="text-[10px] font-mono text-emerald-400/80 block">Benign / Safe</span>
        </div>

        {/* Medium Risk */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-amber-400 text-[11px] font-mono">
            <span>Medium</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-amber-400 block">{riskDist.medium}</span>
          <span className="text-[10px] font-mono text-amber-400/80 block">Suspicious</span>
        </div>

        {/* High Risk */}
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-orange-400 text-[11px] font-mono">
            <span>High Risk</span>
            <ShieldAlert className="h-4 w-4 text-orange-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-orange-400 block">{riskDist.high}</span>
          <span className="text-[10px] font-mono text-orange-400/80 block">Confirmed Threats</span>
        </div>

        {/* Critical Risk */}
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-rose-400 text-[11px] font-mono">
            <span>Critical</span>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-rose-400 block">{riskDist.critical}</span>
          <span className="text-[10px] font-mono text-rose-400/80 block">Active Malware/C2</span>
        </div>
      </div>

      {/* Charts Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Risk Distribution Donut Chart */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3 font-mono">
            <PieIcon className="h-4 w-4 text-cyber-accent" /> Risk Distribution
          </h3>

          <div className="h-56 w-full flex items-center justify-center my-2">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090D16', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#E2E8F0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-cyber-muted font-mono text-xs space-y-1">
                <Inbox className="h-8 w-8 mx-auto opacity-50" />
                <p>No risk data calculated</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-cyber-border/40">
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Low ({riskDist.low})</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Medium ({riskDist.medium})</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span> High ({riskDist.high})</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Critical ({riskDist.critical})</div>
          </div>
        </div>

        {/* Chart 2: IOC Type Distribution Bar Chart */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3 font-mono">
            <BarChart2 className="h-4 w-4 text-purple-400" /> IOC Type Breakdown
          </h3>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090D16', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] font-mono text-cyber-muted border-t border-cyber-border/40 pt-2 flex justify-between">
            <span>IP: {typeDist.ip_address}</span>
            <span>Domain: {typeDist.domain}</span>
            <span>URL: {typeDist.url}</span>
            <span>Hash: {typeDist.file_hash}</span>
          </div>
        </div>

        {/* Chart 3: 7-Day Trend Area Chart */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 border-b border-cyber-border/60 pb-3 font-mono">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> 7-Day Trend
          </h3>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090D16', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#06B6D4' }}
                />
                <Area type="monotone" dataKey="count" stroke="#06B6D4" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] font-mono text-cyber-muted border-t border-cyber-border/40 pt-2 text-right">
            <span>Daily Pipeline Activity</span>
          </div>
        </div>
      </div>

      {/* Five Most Recent Investigations Table */}
      <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 font-mono">
            <Layers className="h-4 w-4 text-cyber-accent" /> Recent Investigations
          </h3>
          <span className="text-xs font-mono text-cyber-muted">Showing 5 Latest Triage Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-cyber-border bg-cyber-surface/80 uppercase text-cyber-muted">
              <tr>
                <th className="px-4 py-3">IOC</th>
                <th className="px-4 py-3">IOC Type</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 text-cyber-text">
              {recentList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-cyber-muted">
                    No recent investigations found in database. Run your first IOC investigation to populate the dashboard!
                  </td>
                </tr>
              ) : (
                recentList.map((item) => (
                  <tr key={item.id} className="hover:bg-cyber-surface/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-emerald-400 max-w-xs truncate">
                      {item.ioc}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {getIocIcon(item.ioc_type)}
                      <span>{item.ioc_type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getSeverityVariant(item.risk_level)}>
                        {item.risk_level}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-cyber-muted whitespace-nowrap">
                      {item.date || item.timestamp || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleSelectRecord(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyber-border bg-cyber-surface px-3 py-1.5 text-xs text-cyber-text hover:border-cyber-accent hover:text-cyber-accent transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 text-cyber-accent" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
