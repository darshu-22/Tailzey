import React from 'react';
import { RefreshCw, RotateCcw, ShieldCheck, X } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import { ANALYZED_VIEWS } from '../../../services/measurementService';
import { CAPTURE_STEPS } from '../../../shared/data/measurementData';
import { describeAnalysisError } from '../lib/analysisErrors';
import AnalysisStages from './AnalysisStages';

/**
 * Step 3: the photos being analysed, the request's real state, and an honest error with
 * retry when the server could not produce estimates.
 */
export default function MeasurementProgress({ status, error, images, onRetry, onCancel, onBackToCapture }) {
  const sentSteps = CAPTURE_STEPS.filter((s) => ANALYZED_VIEWS.includes(s.key) && images[s.key]);
  const failure = status === 'error' ? describeAnalysisError(error) : null;
  const running = status === 'running';

  return (
    <section className="card measure-card analysis-card" aria-labelledby="analysis-title" aria-busy={running}>
      <h2 id="analysis-title" className="measure-card-title">
        {failure ? 'The analysis didn’t finish' : 'Measuring from your photos'}
      </h2>

      <ul className="analysis-thumbs" aria-label="Photos sent">
        {sentSteps.map((step) => (
          <li key={step.key} className="analysis-thumb">
            <img src={images[step.key]} alt={step.name} className="analysis-thumb-img" />
            <span className="analysis-thumb-label">{step.shortName}</span>
          </li>
        ))}
      </ul>

      <div role="status" aria-live="polite">
        <AnalysisStages status={status} photoCount={sentSteps.length} />
      </div>

      {failure && (
        <div className="measure-alert is-danger analysis-error" role="alert">
          <div>
            <h3 className="measure-alert-title">{failure.title}</h3>
            <p>{failure.message}</p>
            {failure.details.length > 0 && (
              <ul className="measure-alert-list">
                {failure.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <p className="measure-privacy">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>Photos are analysed in memory and discarded when the analysis ends. They’re never stored, logged or returned.</span>
      </p>

      <div className="measure-actions">
        {running ? (
          <Button variant="outline" icon={X} onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <>
            <Button variant="outline" icon={RotateCcw} onClick={onBackToCapture}>
              Back to photos
            </Button>
            {failure?.canRetry && (
              <Button size="lg" icon={RefreshCw} onClick={onRetry}>
                Try again
              </Button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
