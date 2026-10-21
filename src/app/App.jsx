import React from 'react';
import AppProviders from './AppProviders';
import RouteOutlet from './router/RouteOutlet';

/** Application root: global providers, skip link and the routed page. */
export default function App() {
  return (
    <AppProviders>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <RouteOutlet />
    </AppProviders>
  );
}
