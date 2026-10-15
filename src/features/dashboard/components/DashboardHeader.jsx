import React from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth, useRouter } from '../../../app/hooks';
import UserMenu from './UserMenu';

/** Dashboard top bar: mobile sidebar toggle, brand link home, and the account menu. */
export default function DashboardHeader({ sidebarOpen, onToggleSidebar, onSignOut }) {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const goHome = () => navigate('home');

  return (
    <header className="dashboard-header" role="banner">
      <div className="dashboard-header-left">
        <button
          type="button"
          className="dashboard-menu-toggle"
          onClick={onToggleSidebar}
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Close sidebar navigation' : 'Open sidebar navigation'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a
          href="#home"
          className="dashboard-brand-link"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
          aria-label="Tailzey — Home"
        >
          <img src="/assets/tailzy-logo.png" alt="Tailzey Logo" className="dashboard-brand-logo" />
        </a>
      </div>

      <div className="dashboard-header-right">
        <UserMenu user={user} onGoHome={goHome} onSignOut={onSignOut} />
      </div>
    </header>
  );
}
