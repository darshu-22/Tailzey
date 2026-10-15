import React from 'react';
import { Home, LayoutDashboard } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import StatusBadge from '../../../shared/ui/StatusBadge';
import Button from '../../../shared/ui/Button';
import DesignerStepper from './DesignerStepper';

/** Designer top bar: brand link, desktop stepper and exits; the mobile stepper sits below it. */
export default function DesignerHeader({ currentStep, onStepChange }) {
  const { navigate } = useRouter();

  return (
    <>
      <header className="designer-header">
        <div className="designer-header-left">
          <a
            href="#dashboard"
            className="designer-brand-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('dashboard');
            }}
            aria-label="Back to dashboard"
          >
            <img src="/assets/tailzy-logo.png" alt="" className="designer-brand-logo" />
            <div className="designer-brand-info">
              <span className="designer-brand-title">TAILZEY</span>
              <span className="designer-brand-subtitle">DREAM OUTFIT STUDIO</span>
            </div>
          </a>
          <StatusBadge variant="gold" dot className="designer-phase-badge">
            Design Studio
          </StatusBadge>
        </div>

        <div className="designer-header-center">
          <DesignerStepper currentStep={currentStep} onStepChange={onStepChange} />
        </div>

        <div className="designer-header-right">
          <Button variant="ghost" size="sm" icon={LayoutDashboard} onClick={() => navigate('dashboard')} ariaLabel="Dashboard">
            Dashboard
          </Button>
          <Button variant="outline" size="sm" icon={Home} onClick={() => navigate('home')} ariaLabel="Website home">
            Home
          </Button>
        </div>
      </header>

      <div className="designer-mobile-stepper-bar">
        <DesignerStepper currentStep={currentStep} onStepChange={onStepChange} />
      </div>
    </>
  );
}
