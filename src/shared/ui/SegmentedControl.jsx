import React, { useId } from 'react';

/**
 * A small set of mutually exclusive choices, rendered as native radio buttons styled as a
 * segmented control, so arrow keys and screen readers work without extra code.
 * options: [{ value, label }] — values may be strings or numbers.
 */
export default function SegmentedControl({ label, options, value, onChange, showLabel = false, disabled = false, className = '' }) {
  const name = useId();

  return (
    <fieldset className={`segmented ${className}`.trim()} disabled={disabled}>
      <legend className={showLabel ? 'segmented-legend' : 'sr-only'}>{label}</legend>
      <div className="segmented-track">
        {options.map((option) => (
          <label key={option.value} className="segmented-option">
            <input
              type="radio"
              className="segmented-input"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="segmented-label">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
