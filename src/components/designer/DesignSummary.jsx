import React from 'react';
import { RotateCcw, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import {
  getGarmentById,
  getColorById,
  getStyleById,
  getFitById,
} from '../../data/designerData';

/**
 * DesignSummary Component
 * Real-time reactive summary card displaying all active garment options,
 * color swatches, status indicator, Reset Design, and Review Design CTA.
 */
export default function DesignSummary({
  garmentId,
  colorId,
  styleId,
  fitId,
  options = {},
  onReset,
  onReview,
  className = '',
}) {
  const garment = getGarmentById(garmentId);
  const color = getColorById(colorId);
  const style = getStyleById(styleId);
  const fit = getFitById(fitId);

  // Helper to format custom attribute labels
  const getCustomLabel = (key, val) => {
    const control = garment.customControls?.[key];
    if (!control) return val;
    const opt = control.options.find((o) => o.id === val);
    return opt ? opt.label : val;
  };

  return (
    <aside
      className={`design-summary-card ${className}`.trim()}
      aria-label="Live Outfit Design Summary"
    >
      {/* Summary Header */}
      <div className="design-summary-header">
        <div>
          <span className="summary-eyebrow">Studio Atelier</span>
          <h3 className="summary-title">Design Summary</h3>
        </div>
        <StatusBadge variant="gold" dot>
          Ready for Review
        </StatusBadge>
      </div>

      <p className="summary-subtext">
        Live parameters update dynamically as you sculpt your bespoke piece.
      </p>

      {/* Structured Specification List */}
      <div className="summary-spec-list">
        {/* Garment Silhouette */}
        <div className="summary-spec-row">
          <span className="spec-label">Garment Type</span>
          <span className="spec-value highlight-gold">{garment.name}</span>
        </div>

        {/* Color Palette */}
        <div className="summary-spec-row">
          <span className="spec-label">Palette</span>
          <div className="spec-color-badge">
            <span
              className="spec-color-dot"
              style={{ backgroundColor: color.hex }}
              aria-hidden="true"
            />
            <span className="spec-value">{color.name}</span>
          </div>
        </div>

        {/* Style Mood */}
        <div className="summary-spec-row">
          <span className="spec-label">Aesthetic Mood</span>
          <span className="spec-value">{style.name}</span>
        </div>

        {/* Fit Profile */}
        <div className="summary-spec-row">
          <span className="spec-label">Fit Profile</span>
          <span className="spec-value">{fit.name}</span>
        </div>

        <div className="summary-divider" aria-hidden="true" />

        {/* Category Tailored Attributes */}
        {Object.entries(garment.customControls || {}).map(([key, config]) => {
          const selectedVal = options[key];
          return (
            <div key={key} className="summary-spec-row">
              <span className="spec-label">{config.label}</span>
              <span className="spec-value spec-value-detail">
                {getCustomLabel(key, selectedVal)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary Actions Footer */}
      <div className="summary-actions-footer">
        <Button
          variant="primary"
          size="md"
          icon={ArrowRight}
          iconPosition="right"
          onClick={onReview}
          className="summary-review-btn"
          ariaLabel="Review Design Specifications"
        >
          Review Design
        </Button>

        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={onReset}
          className="summary-reset-btn"
          ariaLabel="Reset design to default options"
        >
          Reset Selections
        </Button>
      </div>
    </aside>
  );
}
