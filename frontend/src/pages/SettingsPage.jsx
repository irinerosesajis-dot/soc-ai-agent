import React from 'react';
import { ApiConfigForm } from '../components/settings/ApiConfigForm';
import { Settings } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md">
        <h2 className="text-base font-bold text-cyber-text flex items-center gap-2">
          <Settings className="h-5 w-5 text-cyber-accent" /> Agent Settings & API Credentials
        </h2>
        <p className="text-xs text-cyber-muted">
          Manage threat intelligence API keys (VirusTotal, AbuseIPDB), theme display modes, and project details.
        </p>
      </div>

      <ApiConfigForm />
    </div>
  );
};
