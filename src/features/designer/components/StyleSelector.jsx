import React from 'react';
import { Sparkles, Compass, Shield, Feather } from 'lucide-react';
import { STYLES } from '../../../shared/data/designerData';

const STYLE_ICONS = {
  casual: Feather,
  classic: Compass,
  modern: Sparkles,
  formal: Shield,
};

/**
 * StyleSelector Component
 * Segmented selection for design aesthetic moods: Casual, Classic, Modern, Formal.
 */
export default function StyleSelector({
  selectedStyleId,
  onStyleChange,
  className = '',
}) {
  const activeStyle = STYLES.find((s) => s.id === selectedStyleId) || STYLES[0];

  return (
    <div
      className={`style-selector-section ${className}`.trim()}
      role="radiogroup"
      aria-label="Garment Aesthetic Style"
    >
      <div className="custom-control-header">
        <label className="custom-control-label">Aesthetic Mood</label>
        <span className="custom-control-active-val">
          {activeStyle.name} — {activeStyle.tagline}
        </span>
      </div>

      <div className="style-selector-grid">
        {STYLES.map((style) => {
          const isSelected = style.id === selectedStyleId;
          const IconComponent = STYLE_ICONS[style.id] || Sparkles;

          return (
            <button
              key={style.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Style: ${style.name}. ${style.description}`}
              onClick={() => onStyleChange(style.id)}
              className={`style-option-btn ${isSelected ? 'is-selected' : ''}`}
            >
              <div className="style-option-top">
                <IconComponent size={16} className="style-option-icon" aria-hidden="true" />
                <span className="style-option-name">{style.name}</span>
              </div>
              <span className="style-option-tagline">{style.tagline}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
