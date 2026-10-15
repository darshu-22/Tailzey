import React from 'react';
import { AlertTriangle } from 'lucide-react';

/** Brief transition shown while the mannequin is re-dressed after a garment / fit change. */
export function ViewerPreparingOverlay({ garmentName, colorName }) {
  return (
    <div className="viewer-loading-overlay" aria-live="polite">
      <div className="viewer-spinner" aria-hidden="true" />
      <div className="viewer-loading-text">
        <h4 className="viewer-loading-title">Preparing sample mannequin</h4>
        <p className="viewer-loading-sub">
          Dressing it in your {garmentName} in {colorName}…
        </p>
      </div>
    </div>
  );
}

/** Shown when the browser cannot provide WebGL (or the context was lost). */
export function ViewerFallback({ onRetry }) {
  return (
    <div className="viewer-fallback-card" role="alert">
      <div className="fallback-icon-wrap">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>
      <h3 className="fallback-title">3D graphics unavailable</h3>
      <p className="fallback-desc">
        Your browser could not start WebGL, which the 3D viewer needs. Your design and measurements are
        unaffected — you can keep reviewing them in the summary panel.
      </p>
      <button type="button" className="angle-preset-btn is-active" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
