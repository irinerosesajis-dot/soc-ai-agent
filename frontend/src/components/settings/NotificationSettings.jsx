import React, { useState } from 'react';
import { Bell, MessageSquare, Mail, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const NotificationSettings = () => {
  const [slack, setSlack] = useState(true);
  const [pagerduty, setPagerduty] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [teamsWebhook, setTeamsWebhook] = useState(false);

  return (
    <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-5 backdrop-blur-md space-y-5">
      <div className="border-b border-cyber-border/60 pb-3">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyber-accent" /> Alerting & Integrations Channel
        </h3>
        <p className="text-xs text-cyber-muted">Dispatch critical incident alerts and AI playbooks directly to SecOps communication channels</p>
      </div>

      <div className="space-y-3">
        {/* Slack Webhook */}
        <div className="flex items-center justify-between rounded-xl border border-cyber-border bg-cyber-surface/60 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-cyber-text">Slack #secops-alerts Webhook</h4>
              <p className="text-[11px] text-cyber-muted">Post automated incident triage summary cards directly to Slack</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={slack}
            onChange={(e) => setSlack(e.target.checked)}
            className="h-4 w-4 rounded accent-cyber-accent"
          />
        </div>

        {/* PagerDuty */}
        <div className="flex items-center justify-between rounded-xl border border-cyber-border bg-cyber-surface/60 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-cyber-text">PagerDuty Critical Escalation</h4>
              <p className="text-[11px] text-cyber-muted">Trigger high-urgency page to On-Call Tier 3 Commander for Critical threats</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={pagerduty}
            onChange={(e) => setPagerduty(e.target.checked)}
            className="h-4 w-4 rounded accent-cyber-accent"
          />
        </div>

        {/* Email Digest */}
        <div className="flex items-center justify-between rounded-xl border border-cyber-border bg-cyber-surface/60 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-cyber-text">Daily Executive Email Summary</h4>
              <p className="text-[11px] text-cyber-muted">Send daily MTTR metrics report to CISO & Security Leads</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
            className="h-4 w-4 rounded accent-cyber-accent"
          />
        </div>
      </div>
    </div>
  );
};
