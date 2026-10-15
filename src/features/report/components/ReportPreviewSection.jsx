import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { getColorById, getFitById, getGarmentById, getStyleById } from '../../../shared/data/designerData';
import AtelierSilhouetteSvg from '../../designer/components/preview/AtelierSilhouetteSvg';
import { resolveCustomOptions } from '../../designer/lib/designOptions';

/** Section 4: the design illustration, clearly labelled as a sample (not a body model). */
export default function ReportPreviewSection({ design, onOpen3DStudio }) {
  const garment = getGarmentById(design.garmentId);
  const color = getColorById(design.colorId);
  const style = getStyleById(design.styleId);
  const fit = getFitById(design.fitId);

  return (
    <section className="report-section" aria-labelledby="section-preview-title">
      <div className="report-section-header">
        <div className="report-section-title-wrap">
          <span className="report-section-num">04.</span>
          <h2 id="section-preview-title" className="report-section-title">
            Visual Atelier Preview
          </h2>
        </div>
        <span className="report-section-subtitle">Illustration</span>
      </div>

      <div className="report-preview-grid">
        <div
          className="report-preview-visual-frame"
          role="img"
          aria-label={`Illustration of ${garment.name} in ${color.name}`}
        >
          <AtelierSilhouetteSvg
            garmentId={design.garmentId}
            color={color}
            fitId={design.fitId}
            options={resolveCustomOptions(design.garmentId, design.customOptions)}
          />
        </div>

        <div className="report-preview-meta">
          <div className="report-preview-badges">
            <StatusBadge variant="gold" dot>
              Sample Preview Only
            </StatusBadge>
            <span className="report-cell-muted">Standard mannequin form</span>
          </div>

          <h3 className="report-preview-title">
            {garment.name} Silhouette in {color.name}
          </h3>

          <p className="report-preview-desc">
            Drawn with {style.name} cut lines and a {fit.name.toLowerCase()} fit, reflecting your chosen
            silhouette, neckline or lapel, length and fabric tint.
          </p>

          <div className="report-disclaimer-box" role="note">
            <Info size={14} className="report-note-icon" aria-hidden="true" />
            <span>
              <strong>Sample illustration:</strong> the garment is shown on a standard mannequin. It is{' '}
              <strong>not</strong> generated from your body or your measurements.
            </span>
          </div>

          {onOpen3DStudio && (
            <div className="no-print">
              <button
                type="button"
                onClick={onOpen3DStudio}
                className="btn btn-outline btn-sm report-open-3d-btn"
              >
                <Sparkles size={14} aria-hidden="true" />
                <span>Inspect in Interactive 3D Studio</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
