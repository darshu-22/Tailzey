import React from 'react';
import StatusBadge from '../../../shared/ui/StatusBadge';

/** Greeting card at the top of the dashboard. */
export default function DashboardHero({ user }) {
  const firstName = user?.displayName?.trim().split(/\s+/)[0];

  return (
    <div className="dashboard-hero-card">
      <div className="dashboard-hero-badges">
        <StatusBadge variant="gold" dot>
          Atelier Workspace
        </StatusBadge>
      </div>

      <h1 className="dashboard-hero-title">
        Welcome back{firstName ? ', ' : ''}
        {firstName && <span className="text-gold-gradient">{firstName}</span>}
      </h1>

      <p className="dashboard-hero-sub">
        Your personal atelier for bespoke fashion. Shape new silhouettes, refine your measurements, and pick up any
        saved design or fit profile right where you left it.
      </p>
    </div>
  );
}
