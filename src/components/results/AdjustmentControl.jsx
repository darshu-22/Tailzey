import React from 'react';
import { RotateCcw } from 'lucide-react';

/**
 * AdjustmentControl Component
 * Provides user-controlled comfort ease adjustments (+0, +1, +2) per measurement card.
 * Clearly separates base value, adjustment, and resulting value without overwriting originals.
 */
export default function AdjustmentControl({
  fieldId,
  baseValue,
  adjustment = 0,
  unit = 'cm',
  onAdjustmentChange,
  className = '',
}) {
  const hasValue = baseValue !== null && baseValue !== undefined && baseValue !== '' && !isNaN(baseValue);
  const numericBase = hasValue ? parseFloat(baseValue) : null;
  const resultingValue = numericBase !== null ? (numericBase + adjustment).toFixed(1) : null;

  return (
    <div className={`adjustment-control-container ${className}`.trim()}>
      <div className="adjustment-header-row">
        <div>
          <span className="adjustment-title">Tailoring Ease Adjustment</span>
          <span className="adjustment-subtitle">(Optional comfort preference)</span>
        </div>

        {adjustment > 0 && (
          <button
            type="button"
            className="adjustment-reset-link"
            onClick={() => onAdjustmentChange(fieldId, 0)}
            aria-label={`Reset adjustment for ${fieldId}`}
          >
            <RotateCcw size={11} />
            <span>Reset Ease</span>
          </button>
        )}
      </div>

      {/* Segmented Buttons (+0, +1, +2) */}
      <div
        className="adjustment-segmented-buttons"
        role="radiogroup"
        aria-label="Tailoring Ease Adjustment Options"
      >
        <button
          type="button"
          role="radio"
          aria-checked={adjustment === 0}
          disabled={!hasValue}
          className={`adjustment-btn ${adjustment === 0 ? 'is-active' : ''}`}
          onClick={() => onAdjustmentChange(fieldId, 0)}
        >
          No change
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={adjustment === 1}
          disabled={!hasValue}
          className={`adjustment-btn ${adjustment === 1 ? 'is-active' : ''}`}
          onClick={() => onAdjustmentChange(fieldId, 1)}
        >
          +1 {unit}
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={adjustment === 2}
          disabled={!hasValue}
          className={`adjustment-btn ${adjustment === 2 ? 'is-active' : ''}`}
          onClick={() => onAdjustmentChange(fieldId, 2)}
        >
          +2 {unit}
        </button>
      </div>

      {/* Resulting Value Breakdown */}
      {hasValue && (
        <div className="adjustment-breakdown-box">
          <div className="breakdown-metric">
            <span className="breakdown-label">Base:</span>
            <span className="breakdown-val">
              {numericBase} {unit}
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
              {resultingValue} {unit}
            </span>
          </div>
        </div>
      )}

      <p className="adjustment-disclaimer-text">
        User-selected comfort adjustment for garment tailoring. Does not alter your physical body measurement.
      </p>
    </div>
  );
}
