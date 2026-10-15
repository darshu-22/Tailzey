import React from 'react';
import { Sparkles } from 'lucide-react';
import Button from './Button';

/**
 * Reusable EmptyState component for placeholders and empty collections
 */
export default function EmptyState({
  icon: Icon = Sparkles,
  title = 'No Items Found',
  description = 'Your curated collection will appear here once you begin designing.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <div className="empty-state-icon">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
