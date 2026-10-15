import React from 'react';
import { Camera, AlertCircle, Edit3 } from 'lucide-react';
import StatusBadge from '../../../shared/ui/StatusBadge';

/** Profile-level summary: how many values were entered, estimated by camera, or are missing. */
export default function ProfileStatusBadges({ counts, cameraCaptureCount, isCameraCompleted }) {
  return (
    <div className="measurement-status-badges-group" role="group" aria-label="Measurement Profile Status">
      <div className="status-badge-item">
        <StatusBadge variant={counts.entered > 0 ? 'gold' : 'neutral'} icon={Edit3}>
          {counts.entered} Entered by You
        </StatusBadge>
      </div>

      <div className="status-badge-item">
        <StatusBadge variant={counts.estimated > 0 ? 'info' : 'neutral'} icon={Camera}>
          {isCameraCompleted
            ? `${counts.estimated} Camera Estimate${counts.estimated === 1 ? '' : 's'} (${cameraCaptureCount} photos)`
            : 'No Camera Analysis'}
        </StatusBadge>
      </div>

      {counts.missing > 0 && (
        <div className="status-badge-item">
          <StatusBadge variant="bronze" icon={AlertCircle}>
            {counts.missing} Missing Value{counts.missing > 1 ? 's' : ''}
          </StatusBadge>
        </div>
      )}
    </div>
  );
}
