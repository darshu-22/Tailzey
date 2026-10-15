import React from 'react';
import { Info } from 'lucide-react';
import { getColorById, getFitById, getStyleById } from '../../../../shared/data/designerData';
import { useDesignEditor } from '../../hooks/useDesignEditor';
import { describeOption } from '../../lib/designOptions';

const STORAGE_NOTES = {
  new: 'Not saved yet. Use “Save design” to keep it in your account.',
  dirty: 'You have changes since your last save.',
  saving: 'Saving to your account…',
  saved: 'Saved to your account.',
};

function SpecItem({ label, value, sub, highlight = false }) {
  return (
    <div className="spec-item">
      <span className="spec-item-label">{label}</span>
      <span className={`spec-item-val ${highlight ? 'highlight' : ''}`.trim()}>{value}</span>
      {sub && <span className="spec-item-sub">{sub}</span>}
    </div>
  );
}

/** The atelier specification sheet for the workspace design (step 3). */
export default function DesignSpecSheet({ saveStatus, children }) {
  const { design, garment, options } = useDesignEditor();
  const color = getColorById(design.colorId);
  const style = getStyleById(design.styleId);
  const fit = getFitById(design.fitId);
  const fabric = describeOption(garment, 'fabric', options.fabric);
  const detailKeys = Object.keys(garment.customControls || {}).filter((key) => key !== 'fabric');
  const reference = design.designId ? `TZ-${String(design.designId).slice(0, 8).toUpperCase()}` : 'Unsaved draft';

  return (
    <div className="review-spec-sheet-card">
      <div className="spec-sheet-header">
        <div>
          <span className="spec-sheet-badge">HAUTE COUTURE DRAFT</span>
          <h3 className="spec-sheet-title">{design.name || 'Atelier Specification Sheet'}</h3>
        </div>
        <span className="spec-sheet-id">Ref: {reference}</span>
      </div>

      <div className="spec-sheet-sections">
        <div className="spec-block">
          <h4 className="spec-block-title">1. Silhouette & Style</h4>
          <div className="spec-block-grid">
            <SpecItem label="Garment Category" value={garment.name} highlight />
            <SpecItem label="Aesthetic Mood" value={`${style.name} (${style.tagline})`} />
            <SpecItem label="Fit Profile" value={`${fit.name} — ${fit.subtitle}`} />
          </div>
        </div>

        <div className="spec-block">
          <h4 className="spec-block-title">2. Color & Textile</h4>
          <div className="spec-block-grid">
            <div className="spec-item">
              <span className="spec-item-label">Palette Tone</span>
              <div className="spec-color-inline">
                <span className="spec-color-dot" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                <span className="spec-item-val">{color.name}</span>
              </div>
            </div>
            {fabric && <SpecItem label="Fabric Preference" value={fabric.valueLabel} sub={fabric.subtext} />}
          </div>
        </div>

        <div className="spec-block">
          <h4 className="spec-block-title">3. Tailoring Craftsmanship</h4>
          <div className="spec-block-grid">
            {detailKeys.map((key) => {
              const detail = describeOption(garment, key, options[key]);
              return <SpecItem key={key} label={detail.label} value={detail.valueLabel} sub={detail.subtext} />;
            })}
          </div>
        </div>

        <div className="spec-storage-note" role="status">
          <Info size={15} className="spec-storage-icon" aria-hidden="true" />
          <span>{STORAGE_NOTES[saveStatus]}</span>
        </div>
      </div>

      {children}
    </div>
  );
}
