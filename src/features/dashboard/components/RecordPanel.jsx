import React from 'react';
import Button from '../../../shared/ui/Button';
import ErrorState from '../../../shared/ui/ErrorState';
import LoadingState from '../../../shared/ui/LoadingState';
import StatusBadge from '../../../shared/ui/StatusBadge';

/**
 * Dashboard panel for one saved-record collection. Renders the loading, error (with retry)
 * and empty states from a `useSavedRecords` result, and `children` once there are items.
 * The body scrolls on its own so the panel keeps a fixed height.
 */
export default function RecordPanel({
  id,
  title,
  description,
  list,
  newLabel,
  newIcon,
  onNew,
  emptyState,
  className = '',
  children,
}) {
  const hasItems = list.status === 'ready' && list.items.length > 0;

  let body = children;
  if (list.status === 'error') {
    body = <ErrorState title={`Couldn't load ${title.toLowerCase()}`} description={list.error} onRetry={list.retry} />;
  } else if (list.status === 'loading') {
    body = <LoadingState message={`Loading ${title.toLowerCase()}…`} />;
  } else if (!hasItems) {
    body = emptyState;
  }

  return (
    <section className={`card dash-panel ${className}`.trim()} aria-labelledby={`${id}-title`}>
      <header className="dash-panel-header">
        <div className="dash-panel-heading">
          <div className="dash-panel-title-row">
            <h2 id={`${id}-title`} className="dash-section-title">
              {title}
            </h2>
            {list.status === 'ready' && <StatusBadge variant="neutral">{list.total}</StatusBadge>}
          </div>
          <p className="dash-panel-desc">{description}</p>
        </div>
        <Button variant="secondary" size="sm" icon={newIcon} onClick={onNew}>
          {newLabel}
        </Button>
      </header>
      <div className={`dash-panel-body ${hasItems ? '' : 'is-centered'}`.trim()}>{body}</div>
    </section>
  );
}
