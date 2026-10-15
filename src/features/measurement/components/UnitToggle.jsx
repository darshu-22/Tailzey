import React from 'react';

const UNITS = [
  { id: 'cm', label: 'Centimetres (cm)' },
  { id: 'in', label: 'Inches (in)' },
];

/** cm / in segmented toggle used by the height and manual entry forms. */
export default function UnitToggle({ unit, onChange, label = 'Measurement Unit' }) {
  return (
    <div className="unit-toggle-container" role="radiogroup" aria-label={label}>
      {UNITS.map((u) => (
        <button
          key={u.id}
          type="button"
          role="radio"
          aria-checked={unit === u.id}
          className={`unit-toggle-btn ${unit === u.id ? 'is-active' : ''}`}
          onClick={() => onChange(u.id)}
        >
          {u.label}
        </button>
      ))}
    </div>
  );
}
