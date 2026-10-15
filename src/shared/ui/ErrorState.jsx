import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Reusable ErrorState component for displaying friendly, accessible error messages
 */
export default function ErrorState({
  title = 'Unable to Load Details',
  description = 'An unexpected issue occurred while fetching this content. Please try again.',
  retryLabel = 'Try Again',
  onRetry,
  className = '',
}) {
  return (
    <div className={`error-state ${className}`.trim()} role="alert">
      <div className="error-state-icon">
        <AlertCircle size={24} aria-hidden="true" />
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-description">{description}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
