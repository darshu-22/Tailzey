import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth, useRouter } from '../../app/hooks';
import { APP_NAV } from './appNavigation';
import { useSignOut } from './siteNavigation';

const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';

/** Sticky top bar for signed-in pages: brand, primary navigation (desktop) and account. */
export default function AppHeader({ onOpenMenu }) {
  const { user } = useAuth();
  const { route, navigate } = useRouter();
  const signOut = useSignOut();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <a href="#dashboard" className="app-brand" onClick={(e) => (e.preventDefault(), navigate('dashboard'))}>
          <img src="/assets/tailzy-logo.png" alt="" width="32" height="32" />
          <span>Tailzey</span>
        </a>

        <nav className="app-nav" aria-label="Main">
          {APP_NAV.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="app-nav-link"
              aria-current={route === id ? 'page' : undefined}
              onClick={(e) => (e.preventDefault(), navigate(id))}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="app-header-actions">
          <span className="app-avatar" title={user?.displayName} aria-hidden="true">
            {initials(user?.displayName)}
          </span>
          <button type="button" className="app-icon-btn app-signout" onClick={signOut} aria-label="Sign out">
            <LogOut size={18} aria-hidden="true" />
          </button>
          <button type="button" className="app-icon-btn app-menu-btn" onClick={onOpenMenu} aria-label="Open menu">
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
