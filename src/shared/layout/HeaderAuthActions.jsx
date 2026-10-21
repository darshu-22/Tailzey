import React from 'react';
import { useAuth, useRouter } from '../../app/hooks';
import Button from '../ui/Button';
import { useSignOut } from './siteNavigation';

/**
 * Account actions for the public header: "Sign in" + "Get started" for visitors,
 * "Sign out" + "Dashboard" for members. `variant="drawer"` stacks them full-width for the
 * mobile menu. Nothing renders while the session check is pending, to avoid flashing.
 */
export default function HeaderAuthActions({ variant = 'inline', onAction }) {
  const { status } = useAuth();
  const { navigate } = useRouter();
  const signOut = useSignOut();

  if (status === 'loading') return null;

  const authenticated = status === 'authenticated';
  const secondary = authenticated
    ? { label: 'Sign out', action: signOut }
    : { label: 'Sign in', action: () => navigate('signin') };
  const primary = authenticated
    ? { label: 'Dashboard', action: () => navigate('dashboard') }
    : { label: 'Get started', action: () => navigate('signup') };
  const run = (action) => () => {
    onAction?.();
    action();
  };

  const drawer = variant === 'drawer';
  return (
    <div className={drawer ? 'site-auth-actions site-auth-actions-drawer' : 'site-auth-actions'}>
      <Button variant={drawer ? 'secondary' : 'ghost'} size={drawer ? 'lg' : 'md'} onClick={run(secondary.action)}>
        {secondary.label}
      </Button>
      <Button variant="primary" size={drawer ? 'lg' : 'md'} onClick={run(primary.action)}>
        {primary.label}
      </Button>
    </div>
  );
}
