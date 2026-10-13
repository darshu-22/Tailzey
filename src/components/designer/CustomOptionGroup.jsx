import React from 'react';

/**
 * CustomOptionGroup Component
 * Renders category-specific customization options (Neckline, Sleeve length,
 * Garment length, Fabric, Pattern/Embellishment) tailored to the active garment.
 */
export default function CustomOptionGroup({
  controlKey,
  controlConfig,
  selectedValue,
  onChange,
  className = '',
}) {
  if (!controlConfig || !controlConfig.options) return null;

  const currentOption =
    controlConfig.options.find((opt) => opt.id === selectedValue) ||
    controlConfig.options[0];

  return (
    <div
      className={`custom-attribute-group ${className}`.trim()}
      role="radiogroup"
      aria-label={controlConfig.label}
    >
      <div className="custom-control-header">
        <div>
          <label className="custom-control-label">{controlConfig.label}</label>
          {controlConfig.description && (
            <p className="custom-control-subtext">{controlConfig.description}</p>
          )}
        </div>
        <span className="custom-control-active-val">
          {currentOption ? currentOption.label : ''}
        </span>
      </div>

      <div className="custom-attribute-options-grid">
        {controlConfig.options.map((option) => {
          const isSelected = option.id === selectedValue;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${controlConfig.label}: ${option.label}. ${option.subtext || ''}`}
              onClick={() => onChange(controlKey, option.id)}
              className={`custom-attribute-btn ${isSelected ? 'is-selected' : ''}`}
            >
              <div className="custom-attribute-btn-top">
                <span className="custom-attribute-name">{option.label}</span>
                <span
                  className={`custom-attribute-radio-dot ${isSelected ? 'is-active' : ''}`}
                  aria-hidden="true"
                />
              </div>
              {option.subtext && (
                <span className="custom-attribute-subtext">{option.subtext}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
