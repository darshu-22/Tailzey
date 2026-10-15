import React from 'react';
import { ArrowLeft, LayoutDashboard, Home, FileText } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';

/** Top bar of the measurement studio. */
export default function ResultsHeader({ onNavigate }) {
  return (
    <header className="results-header" role="banner">
      <div className="results-header-left">
        <a
          href="#dashboard"
          className="results-brand-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('dashboard');
          }}
          aria-label="Back to Dashboard"
        >
          <img src="/assets/tailzy-logo.png" alt="Tailzey Monogram" className="results-brand-logo" />
          <div className="results-brand-info">
            <span className="results-brand-title">TAILZEY</span>
            <span className="results-brand-subtitle">MEASUREMENT STUDIO</span>
          </div>
        </a>
        <StatusBadge variant="gold" dot className="results-phase-badge">
          Atelier Sizing
        </StatusBadge>
      </div>

      <div className="results-header-right">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => onNavigate('measurement')} ariaLabel="Return to Smart Measurement">
          Smart Measurement
        </Button>
        <Button variant="outline" size="sm" icon={FileText} onClick={() => onNavigate('design-report')} ariaLabel="View Design Report">
          Design Report
        </Button>
        <Button variant="ghost" size="sm" icon={LayoutDashboard} onClick={() => onNavigate('dashboard')} ariaLabel="Return to Dashboard">
          Dashboard
        </Button>
        <Button variant="outline" size="sm" icon={Home} onClick={() => onNavigate('home')} ariaLabel="Return to Home">
          Home
        </Button>
      </div>
    </header>
  );
}
