import React from 'react';
import { Eye, Info, Sparkles } from 'lucide-react';
import { AtelierSilhouetteSvg } from '../designer/GarmentPreview';
import {
  getGarmentById,
  getColorById,
  getStyleById,
  getFitById,
} from '../../data/designerData';
import StatusBadge from '../ui/StatusBadge';

/**
 * ReportPreviewSection Component (Phase 7)
 * Renders Section 4 of the Design Report:
 * Reusable visual silhouette illustration rendered via `AtelierSilhouetteSvg`.
 * Features clear sample-preview labeling and strictly non-personalized 3D disclaimers.
 */
export default function ReportPreviewSection({
  designerSession = {},
  onOpen3DStudio,
}) {
  const garmentId = designerSession.garmentId || 'jacket';
  const colorId = designerSession.colorId || 'black';
  const styleId = designerSession.styleId || 'classic';
  const fitId = designerSession.fitId || 'regular';
  const options = designerSession.customOptions || {};

  const garment = getGarmentById(garmentId);
  const color = getColorById(colorId);
  const style = getStyleById(styleId);
  const fit = getFitById(fitId);

  return (
    <section className="report-section" aria-labelledby="section-preview-title">
      <div className="report-section-header">
        <div className="report-section-title-wrap">
          <span className="report-section-num">04.</span>
          <h2 id="section-preview-title" className="report-section-title">
            Visual Atelier Preview
          </h2>
        </div>
        <span className="report-section-subtitle">Sample Concept Visualization</span>
      </div>

      <div className="report-preview-grid">
        {/* Visual Artwork Container */}
        <div className="report-preview-visual-frame" role="img" aria-label={`Sample silhouette illustration of ${garment.name} in ${color.name}`}>
          <AtelierSilhouetteSvg
            garmentId={garmentId}
            color={color}
            fitId={fitId}
            styleId={styleId}
            options={options}
            isDetailView={false}
          />
        </div>

        {/* Narrative & Atelier Authentication Details */}
        <div className="report-preview-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <StatusBadge variant="gold" dot>
              Sample Preview Only
            </StatusBadge>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Standard Atelier Mannequin Form
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-primary)', margin: 0 }}>
            {garment.name} Silhouette in {color.name}
          </h3>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Rendered with {style.name} cut lines and {fit.name} contour drape. The vector visualization reflects your chosen primary silhouette proportions, lapel/neckline geometry, and luxury fabric tint.
          </p>

          <div className="report-disclaimer-box" role="note" style={{ marginTop: '0.25rem' }}>
            <Info size={14} style={{ color: 'var(--color-gold)', flexShrink: 0 }} aria-hidden="true" />
            <span>
              <strong>Sample Model Notice:</strong> This illustration represents garment styling on a standardized atelier mannequin. It does <strong>not</strong> generate automated personalized body scanning or claim to simulate an exact physical twin.
            </span>
          </div>

          {onOpen3DStudio && (
            <div className="no-print" style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onOpen3DStudio}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                aria-label="Inspect silhouette in 3D Avatar Studio"
              >
                <Sparkles size={14} style={{ color: 'var(--color-gold)' }} />
                <span>Inspect in Interactive 3D Studio</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
