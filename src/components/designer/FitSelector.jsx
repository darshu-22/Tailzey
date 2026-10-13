import React from 'react';
import { FITS } from '../../data/designerData';

/**
 * FitSelector Component
 * Segmented selection for fit profiles: Regular, Slim, Relaxed.
 */
export default function FitSelector({
  selectedFitId,
  onFitChange,
  className = '',
}) {
  const activeFit = FITS.find((f) => f.id === selectedFitId) || FITS[0];

  return (
    <div
      className={`fit-selector-section ${className}`.trim()}
      role="radiogroup"
      aria-label="Fit Preference"
    >
      <div className="custom-control-header">
        <label className="custom-control-label">Fit Preference</label>
        <span className="custom-control-active-val">
          {activeFit.name} — {activeFit.subtitle}
        </span>
      </div>

      <div className="fit-selector-segmented">
        {FITS.map((fit) => {
          const isSelected = fit.id === selectedFitId;

          return (
            <button
              key={fit.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Fit: ${fit.name}. ${fit.description}`}
              onClick={() => onFitChange(fit.id)}
              className={`fit-option-segment ${isSelected ? 'is-selected' : ''}`}
            >
              <div className="fit-option-header">
                <span className="fit-option-title">{fit.name}</span>
                <span className="fit-option-badge">{fit.subtitle}</span>
              </div>
              <p className="fit-option-desc">{fit.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
