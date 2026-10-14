import React from 'react';
import {
  getGarmentById,
  getColorById,
  getStyleById,
  getFitById,
} from '../../data/designerData';

/**
 * ReportOutfitSpec Component (Phase 7)
 * Renders Section 1 of the Design Report:
 * Complete sartorial outfit specification extracted from `designerSession`.
 * Handles category-specific craftsmanship options faithfully without inventing values.
 */
export default function ReportOutfitSpec({
  designerSession = {},
  selectedSize = 'M',
  selectedSizeType = 'letter',
  unit = 'cm',
}) {
  const garmentId = designerSession.garmentId || 'jacket';
  const colorId = designerSession.colorId || 'black';
  const styleId = designerSession.styleId || 'classic';
  const fitId = designerSession.fitId || 'regular';
  const customOptions = designerSession.customOptions || {};

  const garment = getGarmentById(garmentId);
  const color = getColorById(colorId);
  const style = getStyleById(styleId);
  const fit = getFitById(fitId);

  // Helper to extract label and subtext for custom tailoring controls
  const getCustomOptionDetail = (key) => {
    const control = garment.customControls?.[key];
    if (!control) return null;
    const currentVal = customOptions[key] || garment.defaultOptions?.[key];
    const optionObj = control.options.find((o) => o.id === currentVal);
    return {
      label: control.label,
      valueLabel: optionObj ? optionObj.label : currentVal || 'Standard Default',
      subtext: optionObj ? optionObj.subtext : '',
    };
  };

  // Find fabric option if present
  const fabricDetail = getCustomOptionDetail('fabric');

  return (
    <section className="report-section" aria-labelledby="section-outfit-spec-title">
      <div className="report-section-header">
        <div className="report-section-title-wrap">
          <span className="report-section-num">01.</span>
          <h2 id="section-outfit-spec-title" className="report-section-title">
            Outfit Specification & Craftsmanship
          </h2>
        </div>
        <span className="report-section-subtitle">Bespoke Design Blueprint</span>
      </div>

      <div className="report-spec-grid">
        {/* Card 1: Silhouette, Palette & Foundation */}
        <div className="report-spec-card">
          <h3 className="report-spec-card-title">Silhouette & Fabric Palette</h3>

          <div className="report-spec-row">
            <span className="report-spec-label">Garment Silhouette</span>
            <span className="report-spec-value">
              <strong>{garment.name}</strong>
              <span className="report-spec-value-sub">{garment.category}</span>
            </span>
          </div>

          <div className="report-spec-row">
            <span className="report-spec-label">Palette Color</span>
            <span className="report-spec-value">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  className="report-color-dot"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <strong>{color.name}</strong>
              </span>
              <span className="report-spec-value-sub">Hex: {color.hex}</span>
            </span>
          </div>

          {fabricDetail && (
            <div className="report-spec-row">
              <span className="report-spec-label">Fabric Composition</span>
              <span className="report-spec-value">
                <strong>{fabricDetail.valueLabel}</strong>
                {fabricDetail.subtext && (
                  <span className="report-spec-value-sub">{fabricDetail.subtext}</span>
                )}
              </span>
            </div>
          )}

          <div className="report-spec-row">
            <span className="report-spec-label">Aesthetic Mood</span>
            <span className="report-spec-value">
              <strong>{style.name}</strong>
              <span className="report-spec-value-sub">{style.tagline}</span>
            </span>
          </div>

          <div className="report-spec-row">
            <span className="report-spec-label">Fit Drape Contour</span>
            <span className="report-spec-value">
              <strong>{fit.name} Fit</strong>
              <span className="report-spec-value-sub">{fit.subtitle}</span>
            </span>
          </div>
        </div>

        {/* Card 2: Artisanal Tailoring Details & Sizing Framework */}
        <div className="report-spec-card">
          <h3 className="report-spec-card-title">Tailoring Customizations & Size</h3>

          <div className="report-spec-row">
            <span className="report-spec-label">Exploratory Sizing</span>
            <span className="report-spec-value">
              <strong>{selectedSize}</strong>
              <span className="report-spec-value-sub">
                {selectedSizeType === 'numeric' ? 'Category Numeric Benchmark' : 'Standard Letter Benchmark'}
              </span>
            </span>
          </div>

          <div className="report-spec-row">
            <span className="report-spec-label">Measurement Scale</span>
            <span className="report-spec-value">
              <strong>{unit === 'in' ? 'Inches (in)' : 'Centimetres (cm)'}</strong>
            </span>
          </div>

          {/* Render category-specific custom controls */}
          {Object.keys(garment.customControls || {}).map((controlKey) => {
            if (controlKey === 'fabric') return null; // Already shown in card 1
            const detail = getCustomOptionDetail(controlKey);
            if (!detail) return null;

            return (
              <div key={controlKey} className="report-spec-row">
                <span className="report-spec-label">{detail.label}</span>
                <span className="report-spec-value">
                  <strong>{detail.valueLabel}</strong>
                  {detail.subtext && (
                    <span className="report-spec-value-sub">{detail.subtext}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
