import React from 'react';
import { getColorById, getFitById, getGarmentById, getStyleById } from '../../../shared/data/designerData';
import { describeOption, resolveCustomOptions } from '../../designer/lib/designOptions';

function SpecRow({ label, value, sub }) {
  return (
    <div className="report-spec-row">
      <span className="report-spec-label">{label}</span>
      <span className="report-spec-value">
        {value}
        {sub && <span className="report-spec-value-sub">{sub}</span>}
      </span>
    </div>
  );
}

/** Section 1: garment, colour, mood, fit and every garment-specific option of the design. */
export default function ReportOutfitSpec({ design, measurement }) {
  const garment = getGarmentById(design.garmentId);
  const color = getColorById(design.colorId);
  const style = getStyleById(design.styleId);
  const fit = getFitById(design.fitId);
  const options = resolveCustomOptions(design.garmentId, design.customOptions);
  const fabric = describeOption(garment, 'fabric', options.fabric);
  const detailKeys = Object.keys(garment.customControls || {}).filter((key) => key !== 'fabric');

  return (
    <section className="report-section" aria-labelledby="section-outfit-spec-title">
      <div className="report-section-header">
        <div className="report-section-title-wrap">
          <span className="report-section-num">01.</span>
          <h2 id="section-outfit-spec-title" className="report-section-title">
            Outfit Specification & Craftsmanship
          </h2>
        </div>
        <span className="report-section-subtitle">{design.name}</span>
      </div>

      <div className="report-spec-grid">
        <div className="report-spec-card">
          <h3 className="report-spec-card-title">Silhouette & Fabric Palette</h3>
          <SpecRow label="Garment Silhouette" value={<strong>{garment.name}</strong>} sub={garment.category} />
          <SpecRow
            label="Palette Color"
            value={
              <span className="report-color-inline">
                <span className="report-color-dot" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                <strong>{color.name}</strong>
              </span>
            }
            sub={`Hex: ${color.hex}`}
          />
          {fabric && <SpecRow label="Fabric Composition" value={<strong>{fabric.valueLabel}</strong>} sub={fabric.subtext} />}
          <SpecRow label="Aesthetic Mood" value={<strong>{style.name}</strong>} sub={style.tagline} />
          <SpecRow label="Fit Drape Contour" value={<strong>{fit.name} Fit</strong>} sub={fit.subtitle} />
        </div>

        <div className="report-spec-card">
          <h3 className="report-spec-card-title">Tailoring Customizations & Size</h3>
          <SpecRow
            label="Exploratory Sizing"
            value={<strong>{measurement.selectedSize}</strong>}
            sub={measurement.selectedSizeType === 'numeric' ? 'Category Numeric Benchmark' : 'Standard Letter Benchmark'}
          />
          <SpecRow
            label="Measurement Scale"
            value={<strong>{measurement.unit === 'in' ? 'Inches (in)' : 'Centimetres (cm)'}</strong>}
          />
          {detailKeys.map((key) => {
            const detail = describeOption(garment, key, options[key]);
            return <SpecRow key={key} label={detail.label} value={<strong>{detail.valueLabel}</strong>} sub={detail.subtext} />;
          })}
        </div>
      </div>
    </section>
  );
}
