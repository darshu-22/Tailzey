import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';

const VIEWS = [
  { id: 'front', label: 'Front' },
  { id: 'side', label: 'Side' },
  { id: 'back', label: 'Back' },
];

/** Floating toolbar over the canvas: preset views, auto-rotate toggle and reset. */
export default function ViewControls({ autoRotate, onToggleRotate, onView, onReset }) {
  return (
    <div className="studio-toolbar" role="toolbar" aria-label="Camera">
      <div className="studio-toolbar-group">
        {VIEWS.map((view) => (
          <button key={view.id} type="button" className="studio-tool" onClick={() => onView(view.id)}>
            {view.label}
          </button>
        ))}
      </div>
      <div className="studio-toolbar-group">
        <button
          type="button"
          className="studio-tool"
          aria-pressed={autoRotate}
          onClick={onToggleRotate}
        >
          <RotateCw size={16} aria-hidden="true" />
          <span>Rotate</span>
        </button>
        <button type="button" className="studio-tool" onClick={onReset} aria-label="Reset view">
          <RotateCcw size={16} aria-hidden="true" />
          <span className="studio-tool-text">Reset</span>
        </button>
      </div>
      <p className="studio-hint">Drag to turn · scroll or pinch to zoom</p>
    </div>
  );
}
