import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { NewInvestigationPage } from './pages/NewInvestigationPage';
import { InvestigationHistoryPage } from './pages/InvestigationHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { MOCK_IOC_INVESTIGATIONS } from './mockData/incidents';

export function App() {
  const [activeTab, setActiveTab] = useState('new-investigation');
  const [investigations, setInvestigations] = useState(MOCK_IOC_INVESTIGATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRunTriage = (newResult) => {
    if (newResult && !investigations.some(i => i.id === newResult.id)) {
      setInvestigations([newResult, ...investigations]);
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          onNavigateNew={() => setActiveTab('new-investigation')}
        />
      )}

      {activeTab === 'new-investigation' && (
        <NewInvestigationPage
          onStartInvestigation={handleRunTriage}
        />
      )}

      {activeTab === 'history' && (
        <InvestigationHistoryPage
          investigations={investigations}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsPage />
      )}
    </Layout>
  );
}

export default App;
