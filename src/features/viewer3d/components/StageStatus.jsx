import React from 'react';
import { MonitorX } from 'lucide-react';
import LoadingState from '../../../shared/ui/LoadingState';
import ErrorState from '../../../shared/ui/ErrorState';
import EmptyState from '../../../shared/ui/EmptyState';

/** Overlay for every non-ready state of the 3D canvas. Renders nothing when ready. */
export default function StageStatus({ status, onRetry }) {
  if (status === 'ready') return null;

  let content;
  if (status === 'loading') {
    content = <LoadingState message="Loading the 3D studio…" />;
  } else if (status === 'lost') {
    content = <LoadingState message="The graphics device was reset. Restoring the 3D view…" />;
  } else if (status === 'error') {
    content = (
      <ErrorState
        title="The 3D view could not start"
        description="Something went wrong while loading the 3D studio. Your design and measurements are unaffected."
        onRetry={onRetry}
      />
    );
  } else {
    content = (
      <EmptyState
        icon={MonitorX}
        title="3D isn't available on this device"
        description="Your browser doesn't support WebGL 2, which the 3D studio needs. You can still change the outfit and see your measurements here, or use Try on and the report."
      />
    );
  }

  return <div className="studio-stage-status">{content}</div>;
}
