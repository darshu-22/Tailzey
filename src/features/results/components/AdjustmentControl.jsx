import React from 'react';
import { RotateCcw } from 'lucide-react';
import { withAdjustment } from '../lib/studioMath';

const PRESETS = [0, 1, 2];

/**
 * Optional comfort ease (+0 / +1 / +2 in the current unit) for one measurement.
 * The body measurement itself is never changed; ease is stored separately.
 * After a unit change a converted ease (e.g. +0.4 in) is shown as its own option.
 */
export default function AdjustmentControl({ field, baseValue, adjustment = 0, unit, onAdjustmentChange }) {
  const options = PRESETS.includes(adjustment) ? PRESETS : [...PRESETS, adjustment];
  const label = (amount) => (amount === 0 ? 'No change' : `+${amount} ${unit}`);

  return (
    <div className="adjustment-control-container">
      <div className="adjustment-header-row">
        <div>
          <span className="adjustment-title">Tailoring Ease Adjustment</span>
          <span className="adjustment-subtitle">(Optional comfort preference)</span>
        </div>
        {adjustment > 0 && (
          <button
            type="button"
            className="adjustment-reset-link"
            onClick={() => onAdjustmentChange(field.id, 0)}
            aria-label={`Reset ease for ${field.label}`}
          >
            <RotateCcw size={11} />
            <span>Reset Ease</span>
          </button>
        )}
      </div>

      <div className="adjustment-segmented-buttons" role="radiogroup" aria-label={`Tailoring ease for ${field.label}`}>
        {options.map((amount) => (
          <button
            key={amount}
            type="button"
            role="radio"
            aria-checked={adjustment === amount}
            className={`adjustment-btn ${adjustment === amount ? 'is-active' : ''}`}
            onClick={() => onAdjustmentChange(field.id, amount)}
          >
            {label(amount)}
          </button>
        ))}
      </div>

      <div className="adjustment-breakdown-box">
        <div className="breakdown-metric">
          <span className="breakdown-label">Base:</span>
          <span className="breakdown-val">
            {baseValue} {unit}
          </span>
        </div>
        <span className="breakdown-operator">+</span>
        <div className="breakdown-metric">
          <span className="breakdown-label">Ease:</span>
          <span className="breakdown-val highlight">
            {adjustment > 0 ? `+${adjustment}` : '0'} {unit}
          </span>
        </div>
        <span className="breakdown-operator">=</span>
        <div className="breakdown-metric is-result">
          <span className="breakdown-label">Resulting:</span>
          <span className="breakdown-val-result">
            {withAdjustment(baseValue, adjustment)} {unit}
          </span>
        </div>
      </div>

      <p className="adjustment-disclaimer-text">
        User-selected comfort adjustment for garment tailoring. Does not alter your physical body measurement.
      </p>
    </div>
  );
}
