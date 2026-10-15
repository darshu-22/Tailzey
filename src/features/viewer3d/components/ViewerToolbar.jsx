import React from 'react';
import { Layers, RotateCcw, Sun } from 'lucide-react';

/** Top overlay: honest "sample mannequin" label plus wireframe / turntable / lighting toggles. */
export default function ViewerToolbar({
  caption,
  isWireframe,
  onToggleWireframe,
  isAutoRotating,
  onToggleAutoRotate,
  lightingMode,
  onToggleLighting,
}) {
  return (
    <div className="viewer3d-top-overlay">
      <div className="viewer-badge-cluster">
        <span className="viewer-render-tag">Sample Mannequin · Illustrative</span>
        <span className="viewer-badge-caption">{caption}</span>
      </div>

      <div className="viewer-tools-group" role="toolbar" aria-label="3D display modes">
        <button
          type="button"
          className={`viewer-tool-btn ${isWireframe ? 'is-active' : ''}`}
          onClick={onToggleWireframe}
          aria-pressed={isWireframe}
          title="Toggle wireframe mesh"
        >
          <Layers size={13} aria-hidden="true" />
          <span>{isWireframe ? 'Shaded' : 'Wireframe'}</span>
        </button>

        <button
          type="button"
          className={`viewer-tool-btn ${isAutoRotating ? 'is-active' : ''}`}
          onClick={onToggleAutoRotate}
          aria-pressed={isAutoRotating}
          title="360° turntable"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>Turntable</span>
        </button>

        <button
          type="button"
          className={`viewer-tool-btn ${lightingMode === 'dramatic' ? 'is-active' : ''}`}
          onClick={onToggleLighting}
          aria-pressed={lightingMode === 'dramatic'}
          title="Dramatic studio lighting"
        >
          <Sun size={13} aria-hidden="true" />
          <span>Lighting</span>
        </button>
      </div>
    </div>
  );
}
