import React from 'react';
import AppProviders from './AppProviders';
import RouteOutlet from './router/RouteOutlet';

/** Application root: global providers + the routed page. Pages own their own layout. */
export default function App() {
  return (
    <AppProviders>
      <div className="tailzy-app">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <RouteOutlet />
      </div>
    </AppProviders>
  );
}
