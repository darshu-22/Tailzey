import React from 'react';

/**
 * UnitSelector Component
 * Accessible Centimetres / Inches selector with high-contrast active state.
 */
export default function UnitSelector({
  activeUnit = 'cm',
  onUnitChange,
  className = '',
}) {
  return (
    <div
      className={`unit-selector-wrapper ${className}`.trim()}
      role="radiogroup"
      aria-label="Measurement Display Unit"
    >
      <span className="unit-selector-label">Unit of Measure:</span>

      <div className="unit-segmented-control">
        <button
          type="button"
          role="radio"
          aria-checked={activeUnit === 'cm'}
          className={`unit-segment-btn ${activeUnit === 'cm' ? 'is-active' : ''}`}
          onClick={() => onUnitChange('cm')}
        >
          Centimetres (cm)
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={activeUnit === 'in'}
          className={`unit-segment-btn ${activeUnit === 'in' ? 'is-active' : ''}`}
          onClick={() => onUnitChange('in')}
        >
          Inches (in)
        </button>
      </div>
    </div>
  );
}
