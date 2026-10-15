import React from 'react';
import { FileText, Home, LayoutDashboard, Palette, Sliders } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import StatusBadge from '../../../shared/ui/StatusBadge';
import Button from '../../../shared/ui/Button';

const LINKS = [
  { route: 'designer', label: 'Designer', icon: Palette, variant: 'ghost' },
  { route: 'results', label: 'Measurements', icon: Sliders, variant: 'ghost' },
  { route: 'design-report', label: 'Design Report', icon: FileText, variant: 'outline' },
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, variant: 'ghost' },
  { route: 'home', label: 'Home', icon: Home, variant: 'outline' },
];

/** Top bar of the 3D studio with links to the other workspace pages. */
export default function StudioHeader() {
  const { navigate } = useRouter();

  return (
    <header className="studio-header">
      <div className="studio-header-left">
        <a
          href="#dashboard"
          className="studio-brand-link"
          onClick={(e) => {
            e.preventDefault();
            navigate('dashboard');
          }}
          aria-label="Back to dashboard"
        >
          <img src="/assets/tailzy-logo.png" alt="" className="studio-brand-logo" />
          <div className="studio-brand-info">
            <span className="studio-brand-title">TAILZEY</span>
            <span className="studio-brand-subtitle">3D OUTFIT STUDIO</span>
          </div>
        </a>
        <StatusBadge variant="gold" dot className="studio-header-badge">
          3D Fit Studio
        </StatusBadge>
      </div>

      <nav className="studio-header-right" aria-label="Studio navigation">
        {LINKS.map(({ route, label, icon, variant }) => (
          <Button key={route} variant={variant} size="sm" icon={icon} onClick={() => navigate(route)} ariaLabel={label}>
            {label}
          </Button>
        ))}
      </nav>
    </header>
  );
}
