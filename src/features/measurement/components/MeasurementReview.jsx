import React from 'react';
import { Camera, Edit3, LayoutDashboard, Sparkles, Info, Ruler, AlertTriangle, Sliders } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { useWorkspace } from '../../../app/hooks';
import ReviewMeasurementTable from './ReviewMeasurementTable';
import AnalysisViewsPanel from './AnalysisViewsPanel';

/**
 * Review of the measurement workspace after camera analysis or manual entry: every
 * value with its source and ± range, per-photo issues with retake shortcuts, the
 * analysis warnings and its disclaimer. Nothing here is invented — gaps stay gaps.
 */
export default function MeasurementReview({ images, onRetakeView, onEditManual, onDashboard, onDesigner, onContinue }) {
  const { measurement } = useWorkspace();
  const { analysis, unit } = measurement;

  return (
    <div className="measurement-review-container" role="region" aria-label="Measurement Review">
      <div className="review-sheet-header">
        <div className="measurement-badge-row">
          <StatusBadge variant="gold" dot>
            Calibration Review
          </StatusBadge>
          <StatusBadge variant="neutral">{analysis ? 'Camera estimates' : 'Tape measurements'}</StatusBadge>
        </div>
        <h1 className="review-sheet-title">
          Atelier Fit & <span className="text-gold-gradient">Measurement Review</span>
        </h1>
        <p className="review-sheet-subtitle">
          Check each value and where it came from before refining sizes and fit in the Measurement Studio.
        </p>
      </div>

      <div className="review-sheet-layout">
        {analysis && (
          <div className="review-panel-card">
            <div className="review-panel-title-row">
              <div className="review-panel-title-group">
                <Camera size={20} className="panel-title-icon" />
                <h3 className="review-panel-title">Photo Quality</h3>
              </div>
            </div>
            {analysis.warnings?.length > 0 && (
              <div className="analysis-warning-box" role="note">
                <AlertTriangle size={16} className="analysis-warning-icon" aria-hidden="true" />
                <ul className="analysis-issue-list">
                  {analysis.warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
            <AnalysisViewsPanel views={analysis.views} images={images} onRetakeView={onRetakeView} />
          </div>
        )}

        <div className="review-panel-card">
          <div className="review-panel-title-row">
            <div className="review-panel-title-group">
              <Ruler size={20} className="panel-title-icon" />
              <h3 className="review-panel-title">Your Measurements</h3>
            </div>
            <StatusBadge variant="gold">Unit: {unit.toUpperCase()}</StatusBadge>
          </div>
          <ReviewMeasurementTable measurement={measurement} />
          <div className="panel-action-inline">
            <Button variant="outline" size="sm" icon={Edit3} onClick={onEditManual}>
              Edit or Add Measurements
            </Button>
          </div>
        </div>

        {analysis?.disclaimer && (
          <div className="review-honest-banner" role="note">
            <Info size={18} className="honest-banner-icon" aria-hidden="true" />
            <div className="honest-banner-body">
              <h4 className="honest-banner-title">About camera estimates</h4>
              <p className="honest-banner-text">{analysis.disclaimer}</p>
              {analysis.model && <span className="analysis-model-note">Pose model: {analysis.model}</span>}
            </div>
          </div>
        )}

        <div className="review-roadmap-box">
          <Sliders size={20} className="roadmap-icon" aria-hidden="true" />
          <div>
            <h4 className="roadmap-title">Measurement Studio & Size Selector</h4>
            <p className="roadmap-desc">
              Fine-tune values, add comfort ease, explore ready-to-wear size benchmarks and save these
              measurements to your account.
            </p>
          </div>
        </div>

        <div className="review-sheet-actions">
          <div className="sheet-actions-secondary">
            <Button variant="outline" size="md" icon={LayoutDashboard} onClick={onDashboard}>
              Back to Dashboard
            </Button>
            <Button variant="ghost" size="md" icon={Sparkles} onClick={onDesigner}>
              Design Outfit
            </Button>
          </div>
          <Button variant="primary" size="lg" icon={Sliders} onClick={onContinue}>
            Open Measurement Studio
          </Button>
        </div>
      </div>
    </div>
  );
}
