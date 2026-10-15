import React from 'react';
import { FileText, Home, LayoutDashboard, LogOut, Palette, Ruler, Sliders, Sparkles, Trash2 } from 'lucide-react';
import { useRouter } from '../../../app/hooks';

const STUDIO_LINKS = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'designer', label: 'Dream Design', icon: Palette },
  { route: 'measurement', label: 'Smart Measurement', icon: Ruler },
  { route: 'results', label: 'My Measurements', icon: Sliders },
  { route: 'preview3d', label: '3D Outfit Studio', icon: Sparkles },
  { route: 'design-report', label: 'Design Report', icon: FileText },
];

function SidebarButton({ icon: Icon, label, onClick, active = false, className = '' }) {
  return (
    <button
      type="button"
      className={`sidebar-nav-item-btn ${active ? 'is-active' : ''} ${className}`.trim()}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      <Icon size={18} className="sidebar-icon" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

/** Studio navigation + account actions. Fixed column on desktop, slide-in drawer on mobile. */
export default function DashboardSidebar({ isOpen = false, onClose, onSignOut, onDeleteAccount }) {
  const { route, navigate } = useRouter();

  const run = (action) => () => {
    onClose();
    action();
  };

  return (
    <>
      {isOpen && <div className="dashboard-sidebar-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`dashboard-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Dashboard Workspace Navigation">
        <nav aria-label="Studio">
          <span className="sidebar-nav-section-title">Studio Navigation</span>
          <ul className="sidebar-nav-list">
            {STUDIO_LINKS.map((link) => (
              <li key={link.route}>
                <SidebarButton
                  icon={link.icon}
                  label={link.label}
                  active={route === link.route}
                  onClick={run(() => navigate(link.route))}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <span className="sidebar-nav-section-title">Account</span>
          <ul className="sidebar-nav-list">
            <li>
              <SidebarButton icon={LogOut} label="Sign Out" onClick={run(onSignOut)} />
            </li>
            <li>
              <SidebarButton
                icon={Trash2}
                label="Delete Account"
                className="sidebar-nav-item-danger"
                onClick={run(onDeleteAccount)}
              />
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <SidebarButton icon={Home} label="Back to Website" onClick={run(() => navigate('home'))} />
        </div>
      </aside>
    </>
  );
}
