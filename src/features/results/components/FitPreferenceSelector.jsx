import React from 'react';
import { FIT_PREFERENCES } from '../../../shared/data/resultsData';

/** Fit preference (slim / regular / relaxed) as radio cards. It never changes body measurements. */
export default function FitPreferenceSelector({ selectedFitId, onFitChange }) {
  return (
    <section className="fit-section" aria-labelledby="fit-title">
      <div className="fit-section-head">
        <h2 id="fit-title" className="fit-section-title">
          Fit
        </h2>
      </div>
      <p className="fit-section-text">How much room you want in the garment overall. Your body measurements stay the same.</p>

      <fieldset className="choice-fieldset">
        <legend className="sr-only">Fit preference</legend>
        <div className="choice-grid fit-grid">
          {FIT_PREFERENCES.map((fit) => (
            <label key={fit.id} className="choice-card">
              <input
                type="radio"
                className="choice-input"
                name="fit-preference"
                checked={selectedFitId === fit.id}
                onChange={() => onFitChange(fit.id)}
              />
              <span className="choice-body">
                <span className="choice-title">{fit.name}</span>
                <span className="choice-meta">{fit.subtext}</span>
                <span className="choice-desc">{fit.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
