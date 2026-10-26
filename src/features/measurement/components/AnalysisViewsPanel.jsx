import React from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { CAPTURE_STEPS } from '../../../shared/data/measurementData';

function viewState(view) {
  if (!view?.provided) return { label: 'Not taken', variant: 'neutral', action: 'Take photo' };
  if (!view.used) return { label: 'Not usable', variant: 'bronze', action: 'Retake' };
  if (view.issues.length) return { label: 'Used, with notes', variant: 'info', action: 'Retake' };
  return { label: 'Used', variant: 'success', action: null };
}

/**
 * Per-view quality report from the analysis: whether each photo was used, the posture
 * or framing issues found, and a shortcut to retake that view.
 */
export default function AnalysisViewsPanel({ views = {}, images, onRetakeView }) {
  return (
    <ul className="review-views">
      {CAPTURE_STEPS.map((step) => {
        const view = views[step.key];
        const state = viewState(view);
        const image = images[step.key];

        return (
          <li key={step.key} className="review-view">
            <span className="review-view-frame">
              {image ? (
                <img src={image} alt={`${step.name} photo`} className="review-view-img" />
              ) : (
                <Camera size={16} aria-hidden="true" />
              )}
            </span>
            <div className="review-view-body">
              <div className="review-view-head">
                <h3 className="review-view-name">{step.name}</h3>
                <StatusBadge variant={state.variant}>{state.label}</StatusBadge>
              </div>
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
              {view?.issues?.length > 0 && (
                <ul className="review-view-issues">
                  {view.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
