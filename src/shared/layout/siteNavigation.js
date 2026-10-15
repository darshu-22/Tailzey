import { useCallback } from 'react';
import { useAuth, useRouter, useToast } from '../../app/hooks';

/**
 * Site-wide link targets. A link either opens a route (`route`) or scrolls to a
 * section on the home page (`section`). Private routes are guarded by the router,
 * so anonymous visitors are sent to sign-in and brought back afterwards.
 */
export const PRIMARY_LINKS = [
  { label: 'Home', section: 'home' },
  { label: 'Dream Design', route: 'designer' },
  { label: 'Smart Measurement', route: 'measurement' },
  { label: '3D Studio', route: 'preview3d' },
  { label: 'How It Works', section: 'how-it-works' },
];

export const MOBILE_LINKS = [
  { label: 'Home', section: 'home' },
  { label: 'Dream Design', route: 'designer' },
  { label: 'Smart Measurement', route: 'measurement' },
  { label: 'Measurement & Size Studio', route: 'results' },
  { label: '3D Avatar Studio', route: 'preview3d' },
  { label: 'Design Spec Report', route: 'design-report' },
  { label: 'How It Works', section: 'how-it-works' },
];

export const EXPERIENCE_LINKS = [
  { label: 'Dream Outfit Design', route: 'designer' },
  { label: 'Smart Measurement', route: 'measurement' },
  { label: '3D Avatar Studio', route: 'preview3d' },
  { label: 'Measurement Studio', route: 'results' },
  { label: 'Design Spec Report', route: 'design-report' },
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
      notify({ title: 'Signed out', message: 'See you soon at the atelier.', variant: 'info' });
    } catch {
      // The local session is cleared even if the server call fails.
      notify({ title: 'Signed out', message: 'Your session on this device has ended.', variant: 'info' });
    } finally {
      navigate('home');
    }
  }, [logout, navigate, notify]);
}
