import React from 'react';
import { RotateCcw } from 'lucide-react';
import { normalizeYaw } from '../hooks/useOrbitControls';

const PRESETS = [
  { label: 'Front', yaw: 0, description: 'Front view (0 degrees)' },
  { label: '3/4 View', yaw: Math.PI / 4, description: 'Three-quarter view (45 degrees)' },
  { label: 'Side', yaw: Math.PI / 2, description: 'Side profile view (90 degrees)' },
  { label: 'Back', yaw: Math.PI, description: 'Back view (180 degrees)' },
];

/** Bottom bar: preset camera angles, zoom buttons and reset (props from useOrbitControls). */
export default function ViewerAngleControls({ yaw: rawYaw, setAngle, zoomIn, zoomOut, canZoomIn, canZoomOut, resetView }) {
  const yaw = normalizeYaw(rawYaw);

  return (
    <div className="viewer3d-bottom-controls" role="group" aria-label="Viewing angle and zoom controls">
      <div className="angle-presets-group" role="group" aria-label="Camera angle presets">
        {PRESETS.map((preset) => {
          const isActive = Math.abs(yaw - preset.yaw) < 0.25;
          return (
            <button
              key={preset.label}
              type="button"
              className={`angle-preset-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => setAngle(preset.yaw)}
              aria-pressed={isActive}
              aria-label={preset.description}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="zoom-actions-group">
        <button
          type="button"
          className="zoom-ctrl-btn"
          onClick={zoomIn}
          disabled={!canZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="zoom-ctrl-btn"
          onClick={zoomOut}
          disabled={!canZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
        >
          -
        </button>
        <button type="button" className="reset-view-btn" onClick={resetView} title="Reset perspective">
          <RotateCcw size={12} aria-hidden="true" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
}
