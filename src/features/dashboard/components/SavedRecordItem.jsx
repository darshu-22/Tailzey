import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { formatDate } from '../utils/recordFormat';

/** One compact saved design / profile row: title + badges, detail line with date, Open + Delete. */
export default function SavedRecordItem({ icon: Icon, title, details, badges = [], updatedAt, opening, disabled, onOpen, onDelete }) {
  const updated = formatDate(updatedAt);

  return (
    <li className="dash-record">
      <span className="dash-record-icon" aria-hidden="true">
        <Icon size={16} />
      </span>

      <div className="dash-record-info">
        <div className="dash-record-head">
          <h3 className="dash-record-title">{title}</h3>
          {badges.map((badge) => (
            <StatusBadge key={badge.label} variant={badge.variant}>
              {badge.label}
            </StatusBadge>
          ))}
        </div>
        <p className="dash-record-details">
          {details}
          {details && updated && ' · '}
          {updated && (
            <>
              Updated <time dateTime={updatedAt}>{updated}</time>
            </>
          )}
        </p>
      </div>

      <div className="dash-record-actions">
        <Button
          variant="secondary"
          size="sm"
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
          className="dash-icon-btn dash-danger-text"
          onClick={onDelete}
          disabled={disabled}
          ariaLabel={`Delete ${title}`}
        />
      </div>
    </li>
  );
}
