import React from 'react';
import { Camera, CameraOff, RefreshCw, AlertCircle, Edit3 } from 'lucide-react';
import Button from '../../../shared/ui/Button';

/** Viewfinder overlay for the non-live camera states: starting, paused and failed. */
export default function CameraStatusOverlay({ status, error, paused, onResume, onRetry, onSwitchToManual }) {
  if (status === 'error' && error) {
    return (
      <div className="camera-error-overlay" role="alert">
        <AlertCircle size={36} className="camera-error-icon" />
        <h3 className="camera-error-title">{error.title}</h3>
        <p className="camera-error-msg">{error.message}</p>
        <div className="camera-error-actions">
          {error.type !== 'unsupported' && (
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRetry}>
              Retry Camera
            </Button>
          )}
          <Button variant="primary" size="sm" icon={Edit3} onClick={onSwitchToManual}>
            Switch to Manual Entry
          </Button>
        </div>
      </div>
    );
  }

  if (paused) {
    return (
      <div className="camera-state-overlay" role="status">
        <CameraOff size={36} className="camera-state-icon" />
        <p className="camera-state-text">Camera Preview Paused</p>
        <Button variant="primary" size="sm" icon={Camera} onClick={onResume} className="camera-state-action">
          Resume Camera
        </Button>
      </div>
    );
  }

  if (status === 'starting') {
    return (
      <div className="camera-state-overlay" role="status">
        <div className="camera-loading-spinner" aria-hidden="true" />
        <p className="camera-state-text">Starting camera…</p>
        <span className="camera-state-sub">Your browser may ask for permission to use the camera</span>
      </div>
    );
  }

  return null;
}
