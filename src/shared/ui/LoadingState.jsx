import React from 'react';

/**
 * Reusable LoadingState component with luxury spinner and status messaging
 */
export default function LoadingState({
  message = 'Loading Tailzy Experience...',
  className = '',
}) {
  return (
    <div
      className={`loading-state ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <div className="loading-spinner" aria-hidden="true" />
      <span className="loading-text">{message}</span>
    </div>
  );
}
