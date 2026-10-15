import React from 'react';
import Button from '../../../shared/ui/Button';
import ErrorState from '../../../shared/ui/ErrorState';
import LoadingState from '../../../shared/ui/LoadingState';
import StatusBadge from '../../../shared/ui/StatusBadge';

/**
 * Dashboard panel for one saved-record collection. Renders the loading, error (with retry)
 * and empty states from a `useSavedRecords` result, and `children` once there are items.
 */
export default function RecordPanel({ id, title, subtitle, list, newLabel, newIcon, onNew, emptyState, children }) {
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
    <section className="dashboard-panel-box" aria-labelledby={`${id}-title`}>
      <div className="dashboard-panel-header">
        <div>
          <h2 id={`${id}-title`} className="dashboard-panel-title">
            {title}
          </h2>
          <p className="dashboard-panel-subtitle">{subtitle}</p>
        </div>
        <div className="dashboard-panel-meta">
          {list.status === 'ready' && <StatusBadge variant="neutral">{list.total} saved</StatusBadge>}
          <Button variant="ghost" size="sm" icon={newIcon} onClick={onNew}>
            {newLabel}
          </Button>
        </div>
      </div>
      <div className={`dashboard-panel-body ${hasItems ? '' : 'is-centered'}`.trim()}>
        {body}
      </div>
    </section>
  );
}
