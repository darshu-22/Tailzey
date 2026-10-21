import { useCallback } from 'react';
import { useAuth, useRouter, useToast } from '../../app/hooks';

/**
 * Link targets for the public (marketing) header and footer. A link either opens a route
 * (`route`) or scrolls to a section on the home page (`section`). Private routes are guarded
 * by the router, so signed-out visitors are sent to sign-in and brought back afterwards.
 */
export const SITE_LINKS = [
  { label: 'How it works', section: 'how-it-works' },
  { label: 'Features', section: 'features' },
];

export const PRODUCT_LINKS = [
  { label: 'Design an outfit', route: 'designer' },
  { label: 'Measure with your camera', route: 'measurement' },
  { label: 'Try it on', route: 'try-on' },
  { label: '3D studio', route: 'preview3d' },
  { label: 'Design report', route: 'design-report' },
];

/** href for a link target, so links still work with middle-click / open in new tab. */
export const hrefFor = ({ route, section }) => `#${route || section}`;

/** Returns `go(target)` which routes or scrolls, falling back to the home page for sections. */
export function useSiteNavigation() {
  const { route: currentRoute, navigate } = useRouter();

  return useCallback(
    ({ route, section }) => {
      if (route) {
        navigate(route);
        return;
      }
      if (currentRoute !== 'home') {
        navigate('home');
        return;
      }
      if (section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    },
    [currentRoute, navigate]
  );
}

/** Signs out, returns to the home page and confirms with a toast. */
export function useSignOut() {
  const { logout } = useAuth();
  const { navigate } = useRouter();
  const { notify } = useToast();

  return useCallback(async () => {
    try {
      await logout();
      notify({ title: 'Signed out', message: 'You have been signed out.', variant: 'info' });
    } catch {
      // The local session is cleared even if the server call fails.
      notify({ title: 'Signed out', message: 'Your session on this device has ended.', variant: 'info' });
    } finally {
      navigate('home');
    }
  }, [logout, navigate, notify]);
}
