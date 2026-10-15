import { AFTER_SIGN_IN_ROUTE, ROUTES } from './routes';

const KEY = 'tailzey:returnTo';

/** Remember which private page sent the user to sign in (per tab; storage may be unavailable). */
export function rememberReturnRoute(routeId) {
  try {
    window.sessionStorage.setItem(KEY, routeId);
  } catch {
    // private mode / blocked storage — fall back to the default destination
  }
}

/** Where to go after signing in. */
export function consumeReturnRoute() {
  try {
    const target = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
    return target && ROUTES[target]?.access === 'private' ? target : AFTER_SIGN_IN_ROUTE;
  } catch {
    return AFTER_SIGN_IN_ROUTE;
  }
}
