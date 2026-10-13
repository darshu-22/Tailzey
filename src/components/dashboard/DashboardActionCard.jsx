import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';

/**
 * Reusable action card for high-priority studio actions on the dashboard
 */
export default function DashboardActionCard({
  title,
  description,
  badgeText,
  badgeVariant = 'gold',
  icon: Icon,
  actionLabel,
  onClick,
}) {
  return (
    <div className="dash-action-card" onClick={onClick} role="button" tabIndex={0}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="dash-action-icon-wrap">
          {Icon && <Icon size={24} aria-hidden="true" />}
        </div>
        {badgeText && (
          <StatusBadge variant={badgeVariant} dot>
            {badgeText}
          </StatusBadge>
        )}
      </div>

      <h3 className="dash-action-title">{title}</h3>
      <p className="dash-action-desc">{description}</p>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Button
          variant="primary"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
