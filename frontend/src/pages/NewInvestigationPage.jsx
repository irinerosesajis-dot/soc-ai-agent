import React from 'react';
import { InvestigationWizard } from '../components/investigation/InvestigationWizard';

export const NewInvestigationPage = ({ onStartInvestigation }) => {
  return (
    <div className="space-y-6">
      <InvestigationWizard onRunTriage={onStartInvestigation} />
    </div>
  );
};
