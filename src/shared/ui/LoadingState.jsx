import React from 'react';

/**
 * Centered spinner with a short status message.
 */
export default function LoadingState({
  message = 'Loading…',
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
