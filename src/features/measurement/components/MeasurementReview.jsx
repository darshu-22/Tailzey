import React from 'react';
import { AlertTriangle, ArrowRight, Edit3, Info } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import UnitToggle from '../../../shared/measurements/UnitToggle';
import CupSizeCard from '../../../shared/measurements/CupSizeCard';
import { useWorkspace } from '../../../app/hooks';
import ReviewMeasurementTable from './ReviewMeasurementTable';
import AnalysisViewsPanel from './AnalysisViewsPanel';

/**
 * Step 4: every value with its source and ± range, per-photo quality with retake shortcuts,
 * the analysis warnings and its disclaimer. Nothing here is invented; gaps stay gaps.
 */
export default function MeasurementReview({ images, onRetakeView, onEditManual, onContinue }) {
  const { measurement, setUnit } = useWorkspace();
  const { analysis } = measurement;

  return (
    <div className={`review-grid ${analysis ? 'has-photos' : ''}`.trim()}>
      <section className="card measure-card review-values" aria-labelledby="review-values-title">
        <div className="measure-card-head">
          <h2 id="review-values-title" className="measure-card-title">
            Measurements
          </h2>
          <div className="review-values-tools">
            <UnitToggle unit={measurement.unit} onChange={setUnit} />
            <Button variant="outline" size="sm" icon={Edit3} onClick={onEditManual}>
              Edit or add values
            </Button>
          </div>
        </div>
        <ReviewMeasurementTable measurement={measurement} />
        <CupSizeCard measurement={measurement} className="review-cup-size" />
      </section>

      {analysis && (
        <section className="card measure-card review-photos" aria-labelledby="review-photos-title">
          <h2 id="review-photos-title" className="measure-card-title">
            Photo quality
          </h2>
          {analysis.warnings?.length > 0 && (
            <div className="measure-alert is-warning" role="note">
              <AlertTriangle size={16} aria-hidden="true" />
              <ul className="measure-alert-list">
                {analysis.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          <AnalysisViewsPanel views={analysis.views} images={images} onRetakeView={onRetakeView} />

          {analysis.disclaimer && (
            <details className="review-disclaimer">
              <summary className="review-disclaimer-summary">
                <Info size={16} aria-hidden="true" />
                About camera estimates
              </summary>
              <p>{analysis.disclaimer}</p>
              {analysis.model && <p className="review-model">Pose model: {analysis.model}</p>}
            </details>
          )}
        </section>
      )}

      <div className="measure-actions review-actions">
        <p className="review-next">Next, choose a size and fit, add ease where you want more room, and save.</p>
        <Button size="lg" icon={ArrowRight} iconPosition="right" onClick={onContinue}>
          Continue to Fit &amp; Size
        </Button>
      </div>
    </div>
  );
}
