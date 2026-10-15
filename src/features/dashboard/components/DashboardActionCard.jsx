import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';

/** Large call-to-action card for the dashboard's primary studio actions. */
export default function DashboardActionCard({ title, description, badgeText, badgeVariant = 'gold', icon: Icon, actionLabel, onClick }) {
  return (
    <div className="dash-action-card" onClick={onClick}>
      <div className="dash-action-top">
        <div className="dash-action-icon-wrap">{Icon && <Icon size={24} aria-hidden="true" />}</div>
        {badgeText && (
          <StatusBadge variant={badgeVariant} dot>
            {badgeText}
          </StatusBadge>
        )}
      </div>

      <h3 className="dash-action-title">{title}</h3>
      <p className="dash-action-desc">{description}</p>

      <div className="dash-action-footer">
        <Button
          variant="primary"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
