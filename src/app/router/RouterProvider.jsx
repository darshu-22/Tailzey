import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RouterContext } from './RouterContext';
import { DEFAULT_ROUTE, resolveRoute } from './routes';

/** Minimal hash router: the URL hash is the source of truth for the current page. */
export default function RouterProvider({ children }) {
  const [route, setRoute] = useState(() => resolveRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(resolveRoute(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((routeId, { replace = false } = {}) => {
    const hash = routeId === DEFAULT_ROUTE ? '' : `#${routeId}`;
    const url = `${window.location.pathname}${window.location.search}${hash}`;
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
    setRoute(resolveRoute(hash));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo(() => ({ route, navigate }), [route, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
