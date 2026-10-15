import React, { Suspense, useEffect } from 'react';
import LoadingState from '../../shared/ui/LoadingState';
import { useAuth, useRouter } from '../hooks';
import { ROUTES } from './routes';
import { consumeReturnRoute, rememberReturnRoute } from './returnRoute';

const PageFallback = () => (
  <div className="route-fallback">
    <LoadingState message="Loading…" />
  </div>
);

/**
 * Renders the current route, enforcing access rules:
 * private pages need a session (→ sign-in, then back to the page asked for);
 * guest-only pages (sign-in/up) forward signed-in users on.
 */
export default function RouteOutlet() {
  const { route, navigate } = useRouter();
  const { status } = useAuth();
  const { access, component: Page } = ROUTES[route];

  const mustSignIn = access === 'private' && status === 'anonymous';
  const alreadySignedIn = access === 'guest' && status === 'authenticated';

  useEffect(() => {
    if (mustSignIn) {
      rememberReturnRoute(route);
      navigate('signin', { replace: true });
    } else if (alreadySignedIn) {
      navigate(consumeReturnRoute(), { replace: true });
    }
  }, [mustSignIn, alreadySignedIn, route, navigate]);

  if (mustSignIn || alreadySignedIn || (status === 'loading' && access === 'private')) {
    return <PageFallback />;
  }
  return (
    <Suspense fallback={<PageFallback />}>
      <Page />
    </Suspense>
  );
}
