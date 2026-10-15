import React from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { CAPTURE_STEPS } from '../../../shared/data/measurementData';

function viewState(view) {
  if (!view?.provided) return { label: 'Not captured', variant: 'neutral', action: 'Capture this view' };
  if (!view.used) return { label: 'Not usable', variant: 'bronze', action: 'Retake this view' };
  if (view.issues.length) return { label: 'Used, with notes', variant: 'gold', action: 'Retake this view' };
  return { label: 'Used', variant: 'success', action: null };
}

/**
 * Per-view quality report from the analysis: whether each photo was used, the
 * posture or framing issues found, and a shortcut to retake that view.
 */
export default function AnalysisViewsPanel({ views = {}, images, onRetakeView }) {
  return (
    <div className="analysis-views-grid">
      {CAPTURE_STEPS.map((step) => {
        const view = views[step.key];
        const state = viewState(view);
        const image = images[step.key];

        return (
          <div key={step.key} className={`analysis-view-card ${view?.used ? 'is-used' : ''}`}>
            <div className="review-thumb-frame">
              {image ? (
                <img src={image} alt={`${step.name} photo`} className="review-thumb-image" />
              ) : (
                <div className="review-thumb-placeholder">
                  <Camera size={16} aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="analysis-view-body">
              <div className="analysis-view-title-row">
                <span className="review-thumb-caption">{step.name}</span>
                <StatusBadge variant={state.variant}>{state.label}</StatusBadge>
              </div>
              {view?.issues?.length > 0 && (
                <ul className="analysis-issue-list">
                  {view.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              )}
              {state.action && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={RotateCcw}
                  onClick={() => onRetakeView(step.key)}
                  ariaLabel={`${state.action}: ${step.name}`}
                >
                  {state.action}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
