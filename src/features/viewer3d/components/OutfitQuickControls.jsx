import React from 'react';
import { COLORS, GARMENTS } from '../../../shared/data/designerData';

/** Quick garment tabs and colour swatches that edit the workspace design from the 3D studio. */
export default function OutfitQuickControls({ garmentId, colorId, colorName, onGarmentChange, onColorChange }) {
  return (
    <>
      <div>
        <span className="quick-section-title">Garment Silhouette:</span>
        <div className="quick-garment-tabs" role="radiogroup" aria-label="Garment">
          {GARMENTS.map((g) => (
            <button
              key={g.id}
              type="button"
              role="radio"
              aria-checked={garmentId === g.id}
              className={`quick-garment-tab-btn ${garmentId === g.id ? 'is-active' : ''}`}
              onClick={() => onGarmentChange(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className="quick-colors-section">
        <div className="quick-colors-header">
          <span className="quick-section-title">Fabric Palette:</span>
          <span className="quick-colors-active">{colorName}</span>
        </div>
        <div className="quick-swatches-row" role="radiogroup" aria-label="Fabric colour">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={colorId === c.id}
              className={`quick-swatch-circle ${colorId === c.id ? 'is-selected' : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={() => onColorChange(c.id)}
              aria-label={`${c.name} fabric colour`}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </>
  );
}
