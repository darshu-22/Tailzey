import React from 'react';
import {
  Sparkles,
  Info,
  Palette,
  Ruler,
  Sliders,
  ChevronRight,
  LayoutDashboard,
  Check,
} from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import {
  GARMENTS,
  COLORS,
  getGarmentById,
  getColorById,
  getFitById,
  getStyleById,
} from '../../data/designerData';
import { MANUAL_MEASUREMENT_FIELDS } from '../../data/measurementData';

/**
 * OutfitSummaryPanel Component (Phase 6)
 * Luxury glassmorphic panel presenting:
 * - Current Garment & Fabric specifications
 * - Instant 3D Color Swatch Switcher
 * - Calibrated Exploratory Size & Fit Drape Breakdown
 * - Honest Sample Preview Disclaimers
 * - Seamless studio navigation actions
 */
export default function OutfitSummaryPanel({
  garmentId = 'jacket',
  onGarmentChange,
  colorId = 'black',
  onColorChange,
  fitId = 'regular',
  onFitChange,
  styleId = 'classic',
  selectedSize = 'M',
  selectedSizeType = 'letter',
  measurementSession = {},
  unit = 'cm',
  onNavigate,
  className = '',
}) {
  const currentGarment = getGarmentById(garmentId);
  const currentColor = getColorById(colorId);
  const currentFit = getFitById(fitId);
  const currentStyle = getStyleById(styleId);

  // Measurement statistics
  const manualValues = measurementSession?.manualValues || {};
  const enteredCount = Object.values(manualValues).filter(
    (v) => v !== null && v !== undefined && v !== '' && !isNaN(v)
  ).length;

  return (
    <aside
      className={`viewer3d-sidebar-panel ${className}`.trim()}
      aria-label="Atelier Outfit & Sizing Specification"
    >
      <div className="outfit-summary-sheet">
        {/* Header Block */}
        <div className="summary-sheet-top">
          <div>
            <span className="summary-eyebrow">Atelier Studio Preview</span>
            <h3 className="summary-sheet-title">Outfit Specification</h3>
          </div>
          <StatusBadge variant="gold" dot>
            Phase 6 Interactive
          </StatusBadge>
        </div>

        {/* Quick Silhouette Category Tabs */}
        <div>
          <span className="quick-section-title">Garment Silhouette:</span>
          <div className="quick-garment-tabs" role="radiogroup" aria-label="Garment Silhouette Tabs" style={{ marginTop: '0.4rem' }}>
            {GARMENTS.map((g) => (
              <button
                key={g.id}
                type="button"
                role="radio"
                aria-checked={garmentId === g.id}
                className={`quick-garment-tab-btn ${garmentId === g.id ? 'is-active' : ''}`}
                onClick={() => onGarmentChange && onGarmentChange(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live 3D Color Swatch Switcher */}
        <div className="quick-colors-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="quick-section-title">Fabric Palette:</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 500 }}>
              {currentColor.name}
            </span>
          </div>

          <div className="quick-swatches-row" role="radiogroup" aria-label="Fabric Color Swatches">
            {COLORS.slice(0, 8).map((c) => {
              const isSelected = colorId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`quick-swatch-circle ${isSelected ? 'is-selected' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => onColorChange && onColorChange(c.id)}
                  aria-label={`Select ${c.name} fabric color`}
                  title={c.name}
                />
              );
            })}
          </div>
        </div>

        {/* Tailored Specifications Breakdown */}
        <div className="atelier-specs-grid">
          <div className="spec-item-row">
            <span className="spec-item-label">Garment Piece:</span>
            <span className="spec-item-val highlight">{currentGarment.name}</span>
          </div>

          <div className="spec-item-row">
            <span className="spec-item-label">Color Tone:</span>
            <span className="spec-item-val">
              <span className="color-dot-preview" style={{ backgroundColor: currentColor.hex }} />
              {currentColor.name}
            </span>
          </div>

          <div className="spec-item-row">
            <span className="spec-item-label">Style Mood:</span>
            <span className="spec-item-val">{currentStyle.name}</span>
          </div>

          <div className="spec-item-row">
            <span className="spec-item-label">Fit Drape Contour:</span>
            <span className="spec-item-val highlight">
              {currentFit.name}
            </span>
          </div>

          <div className="spec-item-row">
            <span className="spec-item-label">Exploratory Size:</span>
            <span className="spec-item-val">
              {selectedSize} <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>({selectedSizeType})</span>
            </span>
          </div>

          <div className="spec-item-row">
            <span className="spec-item-label">Fit Calibration:</span>
            <span className="spec-item-val">
              {enteredCount > 0 ? (
                `${enteredCount} of 8 Metrics (${unit.toUpperCase()})`
              ) : (
                <span style={{ color: 'var(--color-text-faint)' }}>Standard Mannequin</span>
              )}
            </span>
          </div>
        </div>

        {/* Transparent Sample Preview Disclaimer (Strictly non-AI / non-personalized claim) */}
        <div className="sample-disclaimer-card" role="note">
          <Info size={16} className="disclaimer-icon" aria-hidden="true" />
          <p className="disclaimer-text">
            <strong>Sample Preview Only:</strong> This interactive 3D model reflects your selected garment category, fabric color, fit ease, and aesthetic options on a standard atelier mannequin. It does <strong>not</strong> claim to be an exact custom-made 3D reconstruction, nor does it perform automated physical body scanning.
          </p>
        </div>

        {/* Workflow Navigation Actions */}
        <div className="sidebar-actions-stack">
          <Button
            variant="outline"
            size="md"
            icon={Palette}
            onClick={() => onNavigate && onNavigate('designer')}
            className="sidebar-action-btn"
            ariaLabel="Refine styling in Dream Outfit Designer"
          >
            Refine in Dream Designer
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={Sliders}
            onClick={() => onNavigate && onNavigate('results')}
            className="sidebar-action-btn"
            ariaLabel="Adjust measurements in Measurement Studio"
          >
            Measurement Studio & Sizes
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={LayoutDashboard}
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="sidebar-action-btn"
            ariaLabel="Return to studio dashboard"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </aside>
  );
}
