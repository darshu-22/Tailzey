import { lazy } from 'react';

/**
 * Route table for the hash router. Each page is code-split (lazy) so visitors only
 * download the feature they open.
 *   access: 'public' (anyone) | 'guest' (signed-out only) | 'private' (signed-in only)
 * Private pages are rendered inside the shared AppShell (header + navigation).
 */
export const ROUTES = {
  home: {
    aliases: [],
    access: 'public',
    component: lazy(() => import('../../features/home/pages/HomePage')),
  },
  signin: {
    aliases: [],
    access: 'guest',
    component: lazy(() => import('../../features/auth/pages/SignInPage')),
  },
  signup: {
    aliases: [],
    access: 'guest',
    component: lazy(() => import('../../features/auth/pages/SignUpPage')),
  },
  dashboard: {
    aliases: [],
    access: 'private',
    component: lazy(() => import('../../features/dashboard/pages/DashboardPage')),
  },
  designer: {
    aliases: ['dream-design', 'design'],
    access: 'private',
    component: lazy(() => import('../../features/designer/pages/DesignerPage')),
  },
  measurement: {
    aliases: ['smart-measurement', 'fit'],
    access: 'private',
    component: lazy(() => import('../../features/measurement/pages/SmartMeasurementPage')),
  },
  results: {
    aliases: ['measurement-results', 'size-selector', 'measurement-studio'],
    access: 'private',
    component: lazy(() => import('../../features/results/pages/MeasurementResultsPage')),
  },
  preview3d: {
    aliases: ['avatar-preview', '3d-preview', 'outfit-viewer', '3d-studio'],
    access: 'private',
    component: lazy(() => import('../../features/viewer3d/pages/AvatarPreviewPage')),
  },
  'try-on': {
    aliases: ['tryon', 'virtual-try-on'],
    access: 'private',
    component: lazy(() => import('../../features/tryon/pages/TryOnPage')),
  },
  'design-report': {
    aliases: ['report', 'export', 'dossier'],
    access: 'private',
    component: lazy(() => import('../../features/report/pages/DesignReportPage')),
  },
};

export const DEFAULT_ROUTE = 'home';
export const AFTER_SIGN_IN_ROUTE = 'dashboard';

const ALIASES = Object.fromEntries(
  Object.entries(ROUTES).flatMap(([id, r]) => [[id, id], ...r.aliases.map((a) => [a, id])])
);

/** Map a location hash ("#fit") to a route id ("measurement"). Unknown → home. */
export function resolveRoute(hash) {
  const key = hash.replace(/^#\/?/, '').trim();
  return ALIASES[key] || DEFAULT_ROUTE;
}
