import React from 'react';
import { AlertCircle, Camera, CameraOff, Ruler, RefreshCw } from 'lucide-react';
import Button from '../../../shared/ui/Button';

/** Viewfinder overlay for the non-live camera states: starting, paused and failed. */
export default function CameraStatusOverlay({ status, error, paused, onResume, onRetry, onSwitchToManual }) {
  if (status === 'error' && error) {
    return (
      <div className="viewfinder-state" role="alert">
        <AlertCircle size={32} className="viewfinder-state-icon is-danger" aria-hidden="true" />
        <h2 className="viewfinder-state-title">{error.title}</h2>
        <p className="viewfinder-state-text">{error.message}</p>
        <div className="viewfinder-state-actions">
          {error.type !== 'unsupported' && (
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
              Try again
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={Ruler} onClick={onSwitchToManual}>
            Enter manually
          </Button>
        </div>
      </div>
    );
  }

  if (paused) {
    return (
      <div className="viewfinder-state" role="status">
        <CameraOff size={32} className="viewfinder-state-icon" aria-hidden="true" />
        <p className="viewfinder-state-title">Camera paused</p>
        <Button variant="secondary" size="sm" icon={Camera} onClick={onResume}>
          Resume camera
        </Button>
      </div>
    );
  }

  if (status === 'starting') {
    return (
      <div className="viewfinder-state" role="status">
        <span className="viewfinder-spinner" aria-hidden="true" />
        <p className="viewfinder-state-title">Starting camera…</p>
        <p className="viewfinder-state-text">Your browser may ask for permission to use the camera.</p>
      </div>
    );
  }

  return null;
}
