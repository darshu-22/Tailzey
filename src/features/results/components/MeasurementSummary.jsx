import React from 'react';
import { Sparkles, RotateCcw, Edit3, Info, FileText, Printer } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { GARMENT_CATEGORIES, FIT_PREFERENCES } from '../../../shared/data/resultsData';
import SummaryMetricsList from './SummaryMetricsList';

function cameraNote(measurement, estimatedCount) {
  if (!measurement.isCameraCompleted) return 'No camera analysis is attached to these measurements.';
  return `${estimatedCount} value${estimatedCount === 1 ? '' : 's'} estimated from ${measurement.cameraCaptureCount} photos. Confirm critical measurements with a tape.`;
}

/** Sticky summary of measurements, ease, exploratory size and fit, with next-step actions. */
export default function MeasurementSummary({
  measurement,
  garmentId,
  estimatedCount,
  onEditMeasurements,
  onResetAdjustments,
  onReviewSummary,
  onContinue3D,
  onViewReport,
}) {
  const { values, adjustments, fieldStatus, unit, selectedSize, selectedSizeType, fitPreference } = measurement;
  const garment = GARMENT_CATEGORIES.find((g) => g.id === garmentId) || GARMENT_CATEGORIES[0];
  const fit = FIT_PREFERENCES.find((f) => f.id === fitPreference) || FIT_PREFERENCES[1];
  const adjustedCount = Object.values(adjustments).filter((a) => a > 0).length;

  return (
    <aside className="measurement-summary-card" aria-label="Atelier Measurement Summary">
      <div className="summary-header-block">
        <div>
          <span className="summary-eyebrow-tag">Atelier Sizing Sheet</span>
          <h3 className="summary-sheet-title">Measurement Summary</h3>
        </div>
        <StatusBadge variant="gold" dot>
          {measurement.profileId ? 'Linked to Saved Profile' : 'Not Saved Yet'}
        </StatusBadge>
      </div>

      <p className="summary-lead-text">
        Review your measurements, tailoring ease allowances, and exploratory styling preferences.
      </p>

      <div className="summary-overview-box">
        <div className="overview-row">
          <span className="overview-label">Garment Silhouette:</span>
          <span className="overview-val highlight">{garment.name}</span>
        </div>
        <div className="overview-row">
          <span className="overview-label">Exploratory Size:</span>
          <span className="overview-val highlight">
            {selectedSize}{' '}
            <span className="overview-sub-type">({selectedSizeType === 'numeric' ? 'Numeric' : 'Letter'})</span>
          </span>
        </div>
        <div className="overview-row">
          <span className="overview-label">Fit Drape Preference:</span>
          <span className="overview-val">{fit.name}</span>
        </div>
        <div className="overview-row">
          <span className="overview-label">Tailoring Ease Adjustments:</span>
          <span className="overview-val">{adjustedCount > 0 ? `${adjustedCount} adjusted` : 'Standard (+0)'}</span>
        </div>
      </div>

      <SummaryMetricsList values={values} adjustments={adjustments} fieldStatus={fieldStatus} unit={unit} />

      <div className="summary-camera-session-note">
        <Info size={14} className="summary-note-icon" />
        <span>{cameraNote(measurement, estimatedCount)}</span>
      </div>

      <div className="summary-actions-stack">
        <Button variant="primary" size="lg" icon={Sparkles} onClick={onContinue3D} className="summary-continue-btn">
          Continue to 3D Preview
        </Button>

        <div className="summary-secondary-actions-grid">
          <Button variant="outline" size="sm" icon={Edit3} onClick={onEditMeasurements}>
            Edit Measurements
          </Button>
          <Button variant="outline" size="sm" icon={FileText} onClick={onReviewSummary}>
            Review Summary
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={onResetAdjustments}
          disabled={adjustedCount === 0}
          className="summary-reset-btn"
        >
          Reset Adjustments {adjustedCount > 0 ? `(${adjustedCount} active)` : ''}
        </Button>

        <Button variant="outline" size="sm" icon={Printer} onClick={onViewReport} className="summary-report-btn">
          Export Design Report
        </Button>
      </div>
    </aside>
  );
}
