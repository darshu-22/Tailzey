import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Edit3,
  Check,
  Info,
  ShieldCheck,
  ArrowRight,
  FileText,
  Printer,
} from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { MANUAL_MEASUREMENT_FIELDS } from '../../data/measurementData';
import { GARMENT_CATEGORIES, FIT_PREFERENCES } from '../../data/resultsData';

/**
 * MeasurementSummary Component
 * Consolidates measurements, active adjustments, selected garment category,
 * size exploratory benchmark, and fit preference into a luxury atelier summary sheet.
 */
export default function MeasurementSummary({
  measurements = {},
  adjustments = {},
  unit = 'cm',
  selectedGarmentId = 'jacket',
  selectedSize = 'M',
  selectedSizeType = 'letter',
  selectedFitId = 'regular',
  cameraCaptureCount = 0,
  onEditMeasurements,
  onResetAdjustments,
  onReviewSummary,
  onContinue3D,
  onViewReport,
  className = '',
}) {
  const garment = GARMENT_CATEGORIES.find((g) => g.id === selectedGarmentId) || GARMENT_CATEGORIES[0];
  const fit = FIT_PREFERENCES.find((f) => f.id === selectedFitId) || FIT_PREFERENCES[1];

  const totalAdjustments = Object.values(adjustments).filter((a) => a > 0).length;

  return (
    <aside
      className={`measurement-summary-card ${className}`.trim()}
      aria-label="Atelier Measurement Summary"
    >
      <div className="summary-header-block">
        <div>
          <span className="summary-eyebrow-tag">Atelier Sizing Sheet</span>
          <h3 className="summary-sheet-title">Measurement Summary</h3>
        </div>
        <StatusBadge variant="gold" dot>
          Studio Draft
        </StatusBadge>
      </div>

      <p className="summary-lead-text">
        Review your personalized metrics, tailoring ease allowances, and exploratory styling preferences.
      </p>

      {/* Sizing & Silhouette Overview Block */}
      <div className="summary-overview-box">
        <div className="overview-row">
          <span className="overview-label">Garment Silhouette:</span>
          <span className="overview-val highlight">{garment.name}</span>
        </div>

        <div className="overview-row">
          <span className="overview-label">Exploratory Size:</span>
          <span className="overview-val highlight">
            {selectedSize} <span className="overview-sub-type">({selectedSizeType === 'numeric' ? 'Numeric' : 'Letter'})</span>
          </span>
        </div>

        <div className="overview-row">
          <span className="overview-label">Fit Drape Preference:</span>
          <span className="overview-val">{fit.name}</span>
        </div>

        <div className="overview-row">
          <span className="overview-label">Tailoring Ease Adjustments:</span>
          <span className="overview-val">
            {totalAdjustments > 0 ? `${totalAdjustments} adjusted` : 'Standard (+0)'}
          </span>
        </div>
      </div>

      {/* Measurements Detailed Breakdown */}
      <div className="summary-metrics-list">
        <span className="metrics-list-title">Anatomical Metrics & Comfort Ease ({unit.toUpperCase()})</span>

        {MANUAL_MEASUREMENT_FIELDS.map((field) => {
          const rawVal = measurements[field.id];
          const hasVal = rawVal !== null && rawVal !== undefined && rawVal !== '' && !isNaN(rawVal);
          const adj = adjustments[field.id] || 0;
          const numBase = hasVal ? parseFloat(rawVal) : null;
          const adjustedVal = numBase !== null ? (numBase + adj).toFixed(1) : null;

          return (
            <div key={field.id} className="summary-metric-row">
              <div className="metric-row-name-col">
                <span className="metric-name">{field.label}</span>
                <span className="metric-cat">{field.category}</span>
              </div>

              <div className="metric-row-val-col">
                {hasVal ? (
                  <div className="metric-val-calc">
                    {adj > 0 ? (
                      <>
                        <span className="metric-base-sub">{numBase}</span>
                        <span className="metric-adj-tag">+{adj}</span>
                        <span className="metric-final-val highlight">{adjustedVal} {unit}</span>
                      </>
                    ) : (
                      <span className="metric-final-val">{numBase} {unit}</span>
                    )}
                  </div>
                ) : (
                  <span className="metric-unsupplied">Not recorded</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Camera Session Status Row */}
      <div className="summary-camera-session-note">
        <Info size={14} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
        <span>
          {cameraCaptureCount > 0
            ? `${cameraCaptureCount} camera pose views stored in session memory awaiting future AI analysis.`
            : 'No camera capture session attached to this measurement sheet.'}
        </span>
      </div>

      {/* Summary Actions Footer */}
      <div className="summary-actions-stack">
        <Button
          variant="primary"
          size="lg"
          icon={Sparkles}
          onClick={onContinue3D}
          className="summary-continue-btn"
          ariaLabel="Continue to 3D Preview"
        >
          Continue to 3D Preview
        </Button>

        <div className="summary-secondary-actions-grid">
          <Button
            variant="outline"
            size="sm"
            icon={Edit3}
            onClick={onEditMeasurements}
            ariaLabel="Edit Measurements"
          >
            Edit Measurements
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={onReviewSummary}
            ariaLabel="Review Summary"
          >
            Review Summary
          </Button>
        </div>

          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={onResetAdjustments}
            disabled={totalAdjustments === 0}
            className="summary-reset-btn"
            ariaLabel="Reset Adjustments"
          >
            Reset Adjustments {totalAdjustments > 0 ? `(${totalAdjustments} active)` : ''}
          </Button>

          {onViewReport && (
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={onViewReport}
              style={{ width: '100%', marginTop: '0.4rem' }}
              ariaLabel="Export Custom Design Report"
            >
              Export Design Report
            </Button>
          )}
        </div>
      </aside>
  );
}
