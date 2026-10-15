import React, { useState } from 'react';
import { Info, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { getColorById, getFitById, getStyleById } from '../../../shared/data/designerData';
import { useDesignEditor } from '../hooks/useDesignEditor';
import AtelierSilhouetteSvg from './preview/AtelierSilhouetteSvg';

/**
 * Live illustration of the workspace design with a full / close-up toggle and an
 * optional shortcut into the 3D studio. Clearly labelled as an illustration.
 */
export default function GarmentPreview({ onOpen3DViewer, className = '' }) {
  const [isDetailView, setIsDetailView] = useState(false);
  const { design, garment, options } = useDesignEditor();
  const color = getColorById(design.colorId);
  const style = getStyleById(design.styleId);
  const fit = getFitById(design.fitId);

  return (
    <div className={`garment-preview-card ${className}`.trim()}>
      <div className="preview-top-bar">
        <div className="preview-meta-tags">
          <StatusBadge variant="gold" dot>
            {garment.name}
          </StatusBadge>
          <span className="preview-color-pill">
            <span className="preview-color-dot" style={{ backgroundColor: color.hex }} aria-hidden="true" />
            {color.name}
          </span>
          <span className="preview-spec-pill">{fit.name}</span>
          <span className="preview-spec-pill">{style.name}</span>
        </div>

        <div className="preview-view-actions">
          {onOpen3DViewer && (
            <button
              type="button"
              onClick={onOpen3DViewer}
              className="preview-view-toggle-btn"
              aria-label="Inspect this design in the 3D studio"
              title="Open 3D studio"
            >
              <Sparkles size={14} aria-hidden="true" />
              <span>3D Studio</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDetailView((v) => !v)}
            className="preview-view-toggle-btn"
            aria-pressed={isDetailView}
            aria-label={isDetailView ? 'Switch to full silhouette view' : 'Switch to close-up tailoring view'}
            title={isDetailView ? 'Full silhouette view' : 'Close-up tailoring detail'}
          >
            {isDetailView ? <ZoomOut size={16} aria-hidden="true" /> : <ZoomIn size={16} aria-hidden="true" />}
            <span>{isDetailView ? 'Full View' : 'Detail View'}</span>
          </button>
        </div>
      </div>

      <div className="preview-canvas-box" role="img" aria-label={`Illustration of ${garment.name} in ${color.name}`}>
        <div className="preview-canvas-spotlight" aria-hidden="true" />
        <AtelierSilhouetteSvg
          garmentId={design.garmentId}
          color={color}
          fitId={design.fitId}
          options={options}
          isDetailView={isDetailView}
        />
        <div className="preview-canvas-watermark" aria-hidden="true">
          <span>TAILZEY ATELIER</span>
          <span className="preview-canvas-sub">ILLUSTRATION</span>
        </div>
      </div>

      <div className="preview-disclaimer-card" role="note">
        <Info size={15} className="preview-disclaimer-icon" aria-hidden="true" />
        <div className="preview-disclaimer-text">
          <strong>Illustrative preview:</strong> a styling sketch of your selections, not a pattern or a
          rendering of your body. Open the 3D studio to view the design on a sample mannequin.
        </div>
      </div>
    </div>
  );
}
