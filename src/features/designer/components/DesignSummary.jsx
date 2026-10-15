import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import StatusBadge from '../../../shared/ui/StatusBadge';
import Button from '../../../shared/ui/Button';
import { getColorById, getFitById, getStyleById } from '../../../shared/data/designerData';
import { useDesignEditor } from '../hooks/useDesignEditor';
import { describeOption } from '../lib/designOptions';

/** Live summary of the workspace design with Review and Reset actions. */
export default function DesignSummary({ onReview, className = '' }) {
  const { design, garment, options, resetToDefaults } = useDesignEditor();
  const color = getColorById(design.colorId);
  const style = getStyleById(design.styleId);
  const fit = getFitById(design.fitId);

  return (
    <aside className={`design-summary-card ${className}`.trim()} aria-label="Live outfit design summary">
      <div className="design-summary-header">
        <div>
          <span className="summary-eyebrow">Studio Atelier</span>
          <h3 className="summary-title">Design Summary</h3>
        </div>
        <StatusBadge variant="gold" dot>
          Ready for Review
        </StatusBadge>
      </div>

      <p className="summary-subtext">Updates live as you sculpt your bespoke piece.</p>

      <div className="summary-spec-list">
        <div className="summary-spec-row">
          <span className="spec-label">Garment Type</span>
          <span className="spec-value highlight-gold">{garment.name}</span>
        </div>
        <div className="summary-spec-row">
          <span className="spec-label">Palette</span>
          <div className="spec-color-badge">
            <span className="spec-color-dot" style={{ backgroundColor: color.hex }} aria-hidden="true" />
            <span className="spec-value">{color.name}</span>
          </div>
        </div>
        <div className="summary-spec-row">
          <span className="spec-label">Aesthetic Mood</span>
          <span className="spec-value">{style.name}</span>
        </div>
        <div className="summary-spec-row">
          <span className="spec-label">Fit Profile</span>
          <span className="spec-value">{fit.name}</span>
        </div>

        <div className="summary-divider" aria-hidden="true" />

        {Object.keys(garment.customControls || {}).map((key) => {
          const detail = describeOption(garment, key, options[key]);
          return (
            <div key={key} className="summary-spec-row">
              <span className="spec-label">{detail.label}</span>
              <span className="spec-value spec-value-detail">{detail.valueLabel}</span>
            </div>
          );
        })}
      </div>

      <div className="summary-actions-footer">
        <Button
          variant="primary"
          size="md"
          icon={ArrowRight}
          iconPosition="right"
          onClick={onReview}
          className="summary-review-btn"
        >
          Review Design
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={resetToDefaults}
          className="summary-reset-btn"
          ariaLabel="Reset design to this garment's default options"
        >
          Reset Selections
        </Button>
      </div>
    </aside>
  );
}
