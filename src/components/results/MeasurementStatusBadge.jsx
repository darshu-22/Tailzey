import React from 'react';
import { Check, Camera, AlertCircle, Edit3, Clock } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

/**
 * MeasurementStatusBadge Component
 * Displays clear visual status badges distinguishing:
 * - Manually entered values
 * - Camera captures awaiting analysis
 * - Missing measurements
 */
export default function MeasurementStatusBadge({
  enteredCount = 0,
  totalFields = 8,
  cameraCaptureCount = 0,
  isCameraCompleted = false,
  className = '',
}) {
  const missingCount = totalFields - enteredCount;

  return (
    <div
      className={`measurement-status-badges-group ${className}`.trim()}
      role="group"
      aria-label="Measurement Profile Statuses"
    >
      {/* Manual Entries Status */}
      <div className="status-badge-item">
        <StatusBadge
          variant={enteredCount === totalFields ? 'success' : enteredCount > 0 ? 'gold' : 'neutral'}
          dot
        >
          {enteredCount === totalFields
            ? 'Complete Manual Profile'
            : `${enteredCount} of ${totalFields} Manually Entered`}
        </StatusBadge>
      </div>

      {/* Camera Capture Status */}
      <div className="status-badge-item">
        {isCameraCompleted || cameraCaptureCount > 0 ? (
          <StatusBadge variant="neutral" icon={Camera}>
            {cameraCaptureCount} Views Captured — Awaiting AI Analysis
          </StatusBadge>
        ) : (
          <StatusBadge variant="neutral">
            Camera Capture: Not Recorded
          </StatusBadge>
        )}
      </div>

      {/* Missing Values Status */}
      {missingCount > 0 && (
        <div className="status-badge-item">
          <StatusBadge variant="error" icon={AlertCircle}>
            {missingCount} Missing Value{missingCount > 1 ? 's' : ''}
          </StatusBadge>
        </div>
      )}
    </div>
  );
}
