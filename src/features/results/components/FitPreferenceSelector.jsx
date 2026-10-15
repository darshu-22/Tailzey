import React from 'react';
import { Info, Check } from 'lucide-react';
import { FIT_PREFERENCES } from '../../../shared/data/resultsData';

/**
 * Fit preference (slim / regular / relaxed), with a note that garment ease and body
 * measurements are separate things.
 */
export default function FitPreferenceSelector({ selectedFitId, onFitChange }) {
  return (
    <div
      className="fit-preference-section"
      role="region"
      aria-label="Tailored Fit Preference"
    >
      <div className="fit-preference-header">
        <div>
          <span className="fit-preference-eyebrow">Drape & Silhouette</span>
          <h3 className="fit-preference-title">Fit Preference</h3>
        </div>
      </div>

      <p className="fit-preference-subtext">
        Choose how closely you want your bespoke garments tailored against your natural measurements.
      </p>

      {/* Fit Cards Grid */}
      <div
        className="fit-preferences-grid"
        role="radiogroup"
        aria-label="Fit Preference Options"
      >
        {FIT_PREFERENCES.map((fit) => {
          const isSelected = selectedFitId === fit.id;

          return (
            <button
              key={fit.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`fit-card-btn ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onFitChange(fit.id)}
            >
              <div className="fit-card-top-row">
                <span className="fit-card-name">{fit.name}</span>
                {isSelected && <Check size={16} className="fit-check-icon" />}
              </div>
              <span className="fit-card-subtext">{fit.subtext}</span>
              <p className="fit-card-description">{fit.description}</p>
            </button>
          );
        })}
      </div>

      {/* Conceptual Distinction Notice */}
      <div className="fit-distinction-banner" role="note">
        <Info size={15} className="fit-distinction-icon" aria-hidden="true" />
        <p className="fit-distinction-text">
          <strong>Garment Ease vs. Body Measurements:</strong> Fit preferences guide tailoring ease allowances in garment patterning. Selecting Slim, Regular, or Relaxed does not alter your physical body measurements recorded above.
        </p>
      </div>
    </div>
  );
}
