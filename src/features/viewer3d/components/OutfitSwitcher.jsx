import React from 'react';
import { COLORS, FITS, GARMENTS } from '../../../shared/data/designerData';

/** A group of native radio buttons styled as chips (arrow keys move between them). */
function ChoiceGroup({ legend, name, options, value, onChange, renderLabel, className = '' }) {
  return (
    <fieldset className={`studio-choices ${className}`.trim()}>
      <legend className="studio-choices-legend">{legend}</legend>
      <div className="studio-choices-list">
        {options.map((option) => (
          <label key={option.id} className="studio-choice">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="studio-choice-input"
            />
            {renderLabel(option)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Compact garment, colour and fit switchers; every change is written to the workspace design. */
export default function OutfitSwitcher({ design, spec, onGarment, onColor, onFit }) {
  return (
    <section className="studio-section studio-outfit" aria-labelledby="studio-outfit-heading">
      <h2 id="studio-outfit-heading" className="sr-only">Outfit</h2>

      <ChoiceGroup
        legend="Garment"
        name="studio-garment"
        options={GARMENTS}
        value={design.garmentId}
        onChange={onGarment}
        className="studio-choices-grid"
        renderLabel={(g) => <span className="studio-chip">{g.name}</span>}
      />

      <ChoiceGroup
        legend={`Colour · ${spec.colorName}`}
        name="studio-colour"
        options={COLORS}
        value={design.colorId}
        onChange={onColor}
        className="studio-choices-swatches"
        renderLabel={(c) => (
          <span className="studio-swatch">
            <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <circle cx="16" cy="16" r="15" fill={c.hex} />
            </svg>
            <span className="sr-only">{c.name}</span>
          </span>
        )}
      />

      <ChoiceGroup
        legend="Fit"
        name="studio-fit"
        options={FITS}
        value={design.fitId}
        onChange={onFit}
        className="studio-choices-grid"
        renderLabel={(f) => <span className="studio-chip">{f.name}</span>}
      />
    </section>
  );
}
