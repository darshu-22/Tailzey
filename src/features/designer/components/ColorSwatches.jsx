import React from 'react';
import { Check } from 'lucide-react';
import { COLORS } from '../../../shared/data/designerData';

/**
 * ColorSwatches Component
 * Renders luxury color swatches with accessible states, visible checkmarks,
 * and high-contrast indicators that don't rely solely on color.
 */
export default function ColorSwatches({
  selectedColorId,
  onColorChange,
  className = '',
}) {
  const activeColor = COLORS.find((c) => c.id === selectedColorId) || COLORS[0];

  return (
    <div
      className={`color-swatches-section ${className}`.trim()}
      role="radiogroup"
      aria-label="Garment Color Swatches"
    >
      <div className="custom-control-header">
        <label className="custom-control-label">Garment Palette</label>
        <span className="custom-control-active-val">
          {activeColor.name}
        </span>
      </div>

      <div className="color-swatches-grid">
        {COLORS.map((color) => {
          const isSelected = color.id === selectedColorId;
          const checkColor = color.isLight ? '#120D0A' : '#D9B47A';

          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Color: ${color.name}. ${color.description}`}
              onClick={() => onColorChange(color.id)}
              className={`color-swatch-item ${isSelected ? 'is-selected' : ''}`}
            >
              <div
                className="color-swatch-pill"
                style={{
                  background: `linear-gradient(135deg, ${color.hex} 0%, ${color.secondaryHex} 100%)`,
                  borderColor: isSelected
                    ? 'var(--color-gold)'
                    : color.isLight
                    ? 'rgba(255, 255, 255, 0.4)'
                    : 'rgba(217, 180, 122, 0.25)',
                }}
              >
                {isSelected && (
                  <Check
                    size={16}
                    strokeWidth={3}
                    style={{ color: checkColor }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span className="color-swatch-name">{color.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Color Subtle Tone Note */}
      <p className="color-swatch-desc" aria-live="polite">
        <span className="color-swatch-dot" style={{ backgroundColor: activeColor.hex }} />
        <span>{activeColor.description}</span>
      </p>
    </div>
  );
}
