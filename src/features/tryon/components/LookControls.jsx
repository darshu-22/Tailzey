import React from 'react';
import { COLORS, FITS, GARMENTS } from '../../../shared/data/designerData';

/** Shared wrapper: a labelled group of toggle buttons. */
function OptionGroup({ id, label, children, className = '' }) {
  return (
    <fieldset className="tryon-group">
      <legend className="tryon-group-label" id={id}>
        {label}
      </legend>
      <div className={`tryon-group-options ${className}`.trim()}>{children}</div>
    </fieldset>
  );
}

export function GarmentPicker({ value, onChange }) {
  return (
    <OptionGroup id="tryon-garment" label="Garment" className="tryon-garments">
      {GARMENTS.map((g) => (
        <button
          key={g.id}
          type="button"
          className="tryon-option"
          aria-pressed={value === g.id}
          onClick={() => onChange(g.id)}
        >
          {g.name}
        </button>
      ))}
    </OptionGroup>
  );
}

export function ColorSwatches({ value, onChange }) {
  const current = COLORS.find((c) => c.id === value);
  return (
    <OptionGroup id="tryon-colour" label={`Colour${current ? ` · ${current.name}` : ''}`} className="tryon-swatches">
      {COLORS.map((c) => (
        <button
          key={c.id}
          type="button"
          className="tryon-swatch"
          aria-pressed={value === c.id}
          aria-label={c.name}
          title={c.name}
          onClick={() => onChange(c.id)}
        >
          {/* The swatch colour is catalogue content, drawn as SVG rather than a style attribute. */}
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <circle cx="16" cy="16" r="15" fill={c.hex} />
          </svg>
        </button>
      ))}
    </OptionGroup>
  );
}

export function FitPicker({ value, onChange }) {
  const order = ['slim', 'regular', 'relaxed'];
  const fits = order.map((id) => FITS.find((f) => f.id === id)).filter(Boolean);
  return (
    <OptionGroup id="tryon-fit" label="Fit" className="tryon-fits">
      {fits.map((f) => (
        <button
          key={f.id}
          type="button"
          className="tryon-option"
          aria-pressed={value === f.id}
          onClick={() => onChange(f.id)}
        >
          {f.name}
        </button>
      ))}
    </OptionGroup>
  );
}
