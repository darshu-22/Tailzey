import React from 'react';
import { LayoutDashboard, Home } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';

/** Top bar of the smart measurement page. */
export default function MeasurementHeader({ onNavigate }) {
  return (
    <header className="measurement-header" role="banner">
      <div className="measurement-header-left">
        <a
          href="#dashboard"
          className="measurement-brand-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('dashboard');
          }}
          aria-label="Back to Dashboard"
        >
          <img src="/assets/tailzy-logo.png" alt="Tailzey Monogram" className="measurement-brand-logo" />
          <div className="measurement-brand-info">
            <span className="measurement-brand-title">TAILZEY</span>
            <span className="measurement-brand-subtitle">SMART MEASUREMENT ATELIER</span>
          </div>
        </a>
        <StatusBadge variant="gold" dot className="measurement-phase-badge">
          Guided Fit Calibration
        </StatusBadge>
      </div>

      <div className="measurement-header-right">
        <Button variant="ghost" size="sm" icon={LayoutDashboard} onClick={() => onNavigate('dashboard')} ariaLabel="Return to Dashboard">
          Dashboard
        </Button>
        <Button variant="outline" size="sm" icon={Home} onClick={() => onNavigate('home')} ariaLabel="Return to Website Home">
          Home
        </Button>
      </div>
    </header>
  );
}
