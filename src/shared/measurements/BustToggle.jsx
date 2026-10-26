import React from 'react';

/**
 * Opt-in switch for bust & cup sizing (women's fit). It adds the underbust field and a bra-size
 * guide; switching it off removes the underbust from the measurement.
 */
export default function BustToggle({ checked, onChange, showHint = true }) {
  return (
    <label className={`bust-toggle ${checked ? 'is-on' : ''}`.trim()}>
      <input
        type="checkbox"
        className="bust-toggle-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="bust-toggle-text">
        <span className="bust-toggle-title">Bust &amp; cup size</span>
        {showHint && (
          <span className="bust-toggle-hint">
            Women’s fit: adds your underbust and a bra-size guide. Turn it off to remove it.
          </span>
        )}
      </span>
    </label>
  );
}
