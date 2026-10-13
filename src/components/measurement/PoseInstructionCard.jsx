import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  SkipForward,
  Check,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';

/**
 * PoseInstructionCard Component
 * Displays instructions, pose coaching tips, step progress, and navigation controls
 * for the currently active view in the guided capture sequence.
 */
export default function PoseInstructionCard({
  step,
  stepIndex,
  totalSteps,
  isCaptured,
  isSkipped,
  onPrev,
  onNext,
  onSkip,
  onRetake,
  onFinishSequence,
  className = '',
}) {
  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <div
      className={`pose-instruction-card ${className}`.trim()}
      role="region"
      aria-label={`Instructions for Step ${step.id}: ${step.name}`}
    >
      {/* Step Header */}
      <div className="pose-card-header">
        <div className="pose-step-badge-wrap">
          <StatusBadge variant="gold" dot>
            View {step.id} of {totalSteps}
          </StatusBadge>
          {isCaptured && (
            <StatusBadge variant="success" icon={Check}>
              Captured
            </StatusBadge>
          )}
          {isSkipped && (
            <StatusBadge variant="neutral" icon={SkipForward}>
              Skipped
            </StatusBadge>
          )}
        </div>

        <h3 className="pose-card-title">{step.name}</h3>
        <p className="pose-card-instruction">{step.instruction}</p>
      </div>

      {/* Coaching Tips List */}
      <div className="pose-tips-section">
        <span className="pose-tips-heading">Alignment Coaching</span>
        <ul className="pose-tips-list">
          {step.tips.map((tip, i) => (
            <li key={i} className="pose-tip-item">
              <span className="pose-tip-dot" aria-hidden="true" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Transparency Note */}
      <div className="pose-disclaimer-subtext">
        <Info size={13} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
        <span>Positioning guidance assists silhouette consistency. Millimeter accuracy is not guaranteed.</span>
      </div>

      {/* Action Controls */}
      <div className="pose-card-actions">
        <div className="pose-actions-nav">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            disabled={stepIndex === 0}
            onClick={onPrev}
            ariaLabel="Go to previous capture view"
          >
            Previous
          </Button>

          {isCaptured ? (
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={onRetake}
              ariaLabel="Retake current view"
            >
              Retake View
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              icon={SkipForward}
              onClick={onSkip}
              ariaLabel={`Skip ${step.name}`}
            >
              Skip View
            </Button>
          )}
        </div>

        {isLastStep ? (
          <Button
            variant="primary"
            size="md"
            icon={Sparkles}
            onClick={onFinishSequence}
            ariaLabel="Finish guided capture and review session"
          >
            Review Session
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            onClick={onNext}
            ariaLabel="Go to next capture view"
          >
            Next View
          </Button>
        )}
      </div>
    </div>
  );
}
