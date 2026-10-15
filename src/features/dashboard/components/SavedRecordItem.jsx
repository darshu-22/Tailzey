import React from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { formatDate } from '../utils/recordFormat';

/** One saved design / profile row: title, detail line, badges, updated date, Open + Delete. */
export default function SavedRecordItem({ icon: Icon, title, details, badges = [], updatedAt, opening, disabled, onOpen, onDelete }) {
  const updated = formatDate(updatedAt);

  return (
    <li>
      <Card className="saved-record-card">
        <div className="saved-record-icon" aria-hidden="true">
          <Icon size={18} />
        </div>

        <div className="saved-record-info">
          <h3 className="saved-record-title">{title}</h3>
          {details && <p className="saved-record-details">{details}</p>}
          <div className="saved-record-meta">
            {badges.map((badge) => (
              <StatusBadge key={badge.label} variant={badge.variant}>
                {badge.label}
              </StatusBadge>
            ))}
            {updated && (
              <span className="saved-record-date">
                Updated <time dateTime={updatedAt}>{updated}</time>
              </span>
            )}
          </div>
        </div>

        <div className="saved-record-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={onOpen}
            loading={opening}
            disabled={disabled}
            ariaLabel={`Open ${title}`}
          >
            Open
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="dash-btn-danger-ghost"
            onClick={onDelete}
            disabled={disabled}
            ariaLabel={`Delete ${title}`}
          >
            Delete
          </Button>
        </div>
      </Card>
    </li>
  );
}
