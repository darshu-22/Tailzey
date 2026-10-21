import React from 'react';
import { Camera, Edit3 } from 'lucide-react';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { CONFIDENCE_LABELS, formatUncertainty } from '../../../shared/measurements/estimates';

/**
 * Where one measurement came from: entered by the user, estimated by the camera (with its
 * ± range and confidence), or not recorded.
 */
export default function MeasurementStatusBadge({ hasValue, status, uncertaintyCm, confidence, unit }) {
  if (!hasValue) return <StatusBadge variant="neutral">Not recorded</StatusBadge>;

  if (status === 'camera_estimate') {
    const range = formatUncertainty(uncertaintyCm, unit);
    return (
      <span className="metric-source-stack">
        <StatusBadge variant="info" icon={Camera}>
          Camera{range ? ` ${range}` : ''}
        </StatusBadge>
        {confidence && <span className="metric-confidence">{CONFIDENCE_LABELS[confidence]}</span>}
      </span>
    );
  }

  return (
    <StatusBadge variant="neutral" icon={Edit3}>
      Entered by you
    </StatusBadge>
  );
}
