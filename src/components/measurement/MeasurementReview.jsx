import React from 'react';
import {
  ShieldCheck,
  Check,
  Camera,
  Edit3,
  RotateCcw,
  LayoutDashboard,
  Sparkles,
  Info,
  Ruler,
  AlertTriangle,
  Sliders,
} from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { CAPTURE_STEPS, MANUAL_MEASUREMENT_FIELDS } from '../../data/measurementData';

/**
 * MeasurementReview Component
 * Honest results preview screen that strictly distinguishes between:
 * - Camera capture completed vs actual measurement analysis not yet available.
 * - Manually entered values, displayed exactly as supplied by the user.
 * - Does NOT display fabricated measurement values for camera sessions.
 */
export default function MeasurementReview({
  sessionType = 'camera', // 'camera' | 'manual' | 'both'
  capturedImages = {},
  skippedSteps = {},
  manualValues = {},
  manualUnit = 'cm',
  onEditManual,
  onRetakeCamera,
  onReturnDashboard,
  onGoToDesigner,
  onGoToResults,
  className = '',
}) {
  const capturedCount = Object.keys(capturedImages).length;
  const skippedCount = Object.keys(skippedSteps).length;

  return (
    <div
      className={`measurement-review-container ${className}`.trim()}
      role="region"
      aria-label="Measurement Calibration Review"
    >
      {/* Hero Header */}
      <div className="review-sheet-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <StatusBadge variant="gold" dot>
            Calibration Review
          </StatusBadge>
          <StatusBadge variant="neutral">
            Phase 4 Prototype
          </StatusBadge>
        </div>

        <h1 className="review-sheet-title">
          Atelier Fit & <span className="text-gold-gradient">Measurement Review</span>
        </h1>
        <p className="review-sheet-subtitle">
          Review your recorded silhouette capture and tailored proportions before building your bespoke creations.
        </p>
      </div>

      <div className="review-sheet-layout">
        {/* SECTION A: CAMERA CAPTURE SESSION */}
        {(sessionType === 'camera' || sessionType === 'both') && (
          <div className="review-panel-card">
            <div className="review-panel-title-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Camera size={20} className="panel-title-icon" />
                <h3 className="review-panel-title">Camera Capture Summary</h3>
              </div>
              <StatusBadge variant="gold">
                {capturedCount} of {CAPTURE_STEPS.length} Captured
              </StatusBadge>
            </div>

            {/* Thumbnails Gallery */}
            <div className="review-camera-grid">
              {CAPTURE_STEPS.map((step) => {
                const img = capturedImages[step.key];
                const isSkipped = skippedSteps[step.key];

                return (
                  <div key={step.key} className="review-camera-thumb-card">
                    <div className="review-thumb-frame">
                      {img ? (
                        <img
                          src={img}
                          alt={`Captured ${step.name}`}
                          className="review-thumb-image"
                        />
                      ) : (
                        <div className="review-thumb-placeholder">
                          <span>{isSkipped ? 'Skipped' : 'Pending'}</span>
                        </div>
                      )}
                    </div>
                    <span className="review-thumb-caption">{step.shortName}</span>
                  </div>
                );
              })}
            </div>

            {/* Honest Camera Analysis Status */}
            <div className="review-honest-banner" role="note">
              <Info size={18} className="honest-banner-icon" aria-hidden="true" />
              <div className="honest-banner-body">
                <h4 className="honest-banner-title">
                  Automated Measurement Analysis Not Yet Available
                </h4>
                <p className="honest-banner-text">
                  Your 6-view capture session was saved temporarily in local memory. Real-time computer vision body geometry, 3D anatomical meshing, and automated circumference extraction will be activated in upcoming releases. To preserve accuracy and trust, <strong>no fabricated or simulated numbers are displayed.</strong>
                </p>
              </div>
            </div>

            {onRetakeCamera && (
              <div className="panel-action-inline">
                <Button
                  variant="outline"
                  size="sm"
                  icon={RotateCcw}
                  onClick={onRetakeCamera}
                  ariaLabel="Retake camera capture views"
                >
                  Retake Guided Views
                </Button>
              </div>
            )}
          </div>
        )}

        {/* SECTION B: MANUALLY ENTERED VALUES */}
        {(sessionType === 'manual' || sessionType === 'both') && (
          <div className="review-panel-card">
            <div className="review-panel-title-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Ruler size={20} className="panel-title-icon" />
                <h3 className="review-panel-title">Manual Tape Measurements</h3>
              </div>
              <StatusBadge variant="gold">
                Unit: {manualUnit.toUpperCase()}
              </StatusBadge>
            </div>

            <p className="review-panel-subtext">
              These values reflect only the measurements you personally entered.
            </p>

            {/* Measurements Table / Grid */}
            <div className="review-measurements-table">
              {MANUAL_MEASUREMENT_FIELDS.map((field) => {
                const val = manualValues[field.id];
                const hasValue = val && val.trim() !== '';

                return (
                  <div key={field.id} className="review-measure-row">
                    <div className="measure-name-col">
                      <span className="measure-label">{field.label}</span>
                      <span className="measure-category">{field.category}</span>
                    </div>

                    <div className="measure-val-col">
                      {hasValue ? (
                        <span className="measure-number highlight">
                          {val} <span className="measure-unit">{manualUnit}</span>
                        </span>
                      ) : (
                        <span className="measure-empty">Not specified</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {onEditManual && (
              <div className="panel-action-inline">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit3}
                  onClick={onEditManual}
                  ariaLabel="Edit manual measurement entries"
                >
                  Edit Measurements
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Phase 5 Sizing & Measurement Studio Notice */}
        <div className="review-roadmap-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sliders size={20} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
            <div>
              <h4 className="roadmap-title">Phase 5: Measurement Studio & Size Selector Ready</h4>
              <p className="roadmap-desc">
                Review, edit, and fine-tune your measurements with tailoring comfort ease allowances (+1/+2) and explore ready-to-wear sizing benchmarks in Your Measurement Studio.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="review-sheet-actions">
          <div className="sheet-actions-secondary">
            <Button
              variant="outline"
              size="md"
              icon={LayoutDashboard}
              onClick={onReturnDashboard}
              ariaLabel="Return to studio dashboard"
            >
              Back to Dashboard
            </Button>
            <Button
              variant="ghost"
              size="md"
              icon={Sparkles}
              onClick={onGoToDesigner}
              ariaLabel="Proceed to Dream Outfit Designer"
            >
              Design Outfit
            </Button>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Sliders}
            onClick={onGoToResults}
            ariaLabel="Open Measurement Studio & Size Selector"
          >
            Open Measurement Studio & Size Selector
          </Button>
        </div>
      </div>
    </div>
  );
}
