import React from 'react';
import { LayoutDashboard, LogOut, Sparkles, User } from 'lucide-react';
import { useAuth, useRouter } from '../../app/hooks';
import Button from '../ui/Button';
import { useSignOut } from './siteNavigation';

/**
 * Header account actions: "Sign In" + "Get Started" for visitors, "Dashboard" + "Sign Out"
 * for members. `variant="drawer"` renders the full-width stacked buttons for the mobile menu.
 * Nothing renders while the session check is pending, to avoid flashing the wrong state.
 */
export default function HeaderAuthActions({ variant = 'inline', onAction }) {
  const { status } = useAuth();
  const { navigate } = useRouter();
  const signOut = useSignOut();

  if (status === 'loading') return null;

  const authenticated = status === 'authenticated';
  const secondary = authenticated
    ? { label: 'Dashboard', icon: LayoutDashboard, action: () => navigate('dashboard') }
    : { label: 'Sign In', icon: User, action: () => navigate('signin') };
  const primary = authenticated
    ? { label: 'Sign Out', icon: LogOut, action: signOut }
    : { label: 'Get Started', icon: Sparkles, action: () => navigate('signup') };
  const run = (action) => () => {
    onAction?.();
    action();
  };

  if (variant === 'drawer') {
    return (
      <>
        <Button variant="outline" size="md" icon={secondary.icon} onClick={run(secondary.action)} className="header-drawer-btn">
          {secondary.label}
        </Button>
        <Button variant="primary" size="md" icon={primary.icon} onClick={run(primary.action)} className="header-drawer-btn">
          {primary.label}
        </Button>
      </>
    );
  }

  const SecondaryIcon = secondary.icon;
  return (
    <>
      <button type="button" className="nav-link header-text-btn" onClick={run(secondary.action)}>
        <SecondaryIcon size={15} aria-hidden="true" className="header-text-btn-icon" />
        <span>{secondary.label}</span>
      </button>
      <Button
        variant={authenticated ? 'outline' : 'primary'}
        size="sm"
        icon={primary.icon}
        onClick={run(primary.action)}
        className="header-cta-btn"
      >
        {primary.label}
      </Button>
    </>
  );
}
