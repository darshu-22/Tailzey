import React from 'react';
import { RotateCcw, ShieldCheck, X, RefreshCw, Edit3 } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { ANALYZED_VIEWS } from '../../../services/measurementService';
import { CAPTURE_STEPS } from '../../../shared/data/measurementData';
import { describeAnalysisError } from '../lib/analysisErrors';
import AnalysisStages from './AnalysisStages';

/**
 * Real analysis progress: the captured views being sent, the request's state, and an
 * honest error with retry when the server could not produce estimates.
 */
export default function MeasurementProgress({ status, error, images, onRetry, onCancel, onBackToCapture, onManual }) {
  const sentSteps = CAPTURE_STEPS.filter((s) => ANALYZED_VIEWS.includes(s.key) && images[s.key]);
  const failure = status === 'error' ? describeAnalysisError(error) : null;

  return (
    <div className="measurement-progress-card" role="region" aria-label="Measurement analysis progress" aria-busy={status === 'running'}>
      <div className="progress-header">
        <div className="measurement-badge-row">
          <StatusBadge variant="gold" dot>
            Camera Analysis
          </StatusBadge>
          <StatusBadge variant={failure ? 'bronze' : 'neutral'}>{failure ? 'Needs attention' : 'In progress'}</StatusBadge>
        </div>
        <h2 className="progress-title">
          Analysing your <span className="text-gold-gradient">Photos</span>
        </h2>
        <p className="progress-subtitle">
          Your body outline is measured in each photo and scaled using your height. This usually takes a few seconds.
        </p>
      </div>

      <div className="progress-thumbs-preview">
        <span className="progress-thumbs-label">Photos sent for analysis ({sentSteps.length})</span>
        <div className="progress-thumbs-grid">
          {sentSteps.map((step) => (
            <div key={step.key} className="progress-mini-thumb">
              <img src={images[step.key]} alt={step.name} className="progress-mini-img" />
              <span className="progress-mini-name">{step.shortName}</span>
            </div>
          ))}
        </div>
      </div>

      <AnalysisStages status={status} photoCount={sentSteps.length} />

      {failure && (
        <div className="analysis-error-box" role="alert">
          <h4 className="analysis-error-title">{failure.title}</h4>
          <p className="analysis-error-text">{failure.message}</p>
          {failure.details.length > 0 && (
            <ul className="analysis-issue-list">
              {failure.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="progress-transparency-box" role="note">
        <ShieldCheck size={18} className="transparency-icon" aria-hidden="true" />
        <div className="transparency-content">
          <h4 className="transparency-title">Your photos stay private</h4>
          <p className="transparency-text">
            Photos are analysed in memory on the Tailzey server and discarded when the analysis ends. They are
            never written to disk, stored, logged or returned.
          </p>
        </div>
      </div>

      <div className="progress-actions-bar">
        {status === 'running' ? (
          <Button variant="outline" size="md" icon={X} onClick={onCancel}>
            Cancel Analysis
          </Button>
        ) : (
          <>
            <div className="sheet-actions-secondary">
              <Button variant="outline" size="md" icon={RotateCcw} onClick={onBackToCapture}>
                Back to Photos
              </Button>
              <Button variant="ghost" size="md" icon={Edit3} onClick={onManual}>
                Enter Manually
              </Button>
            </div>
            {failure?.canRetry && (
              <Button variant="primary" size="lg" icon={RefreshCw} onClick={onRetry}>
                Try Again
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
