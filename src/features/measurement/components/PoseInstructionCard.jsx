import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, SkipForward, Check, Info, Sparkles } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';

/**
 * Coaching for the active capture view plus sequence navigation. On the last view
 * the primary action sends the photos for analysis once a front or back view exists.
 */
export default function PoseInstructionCard({
  step,
  totalSteps,
  isFirstStep,
  isLastStep,
  isCaptured,
  isSkipped,
  canAnalyse,
  finishHint,
  onPrev,
  onNext,
  onSkip,
  onRetake,
  onAnalyse,
}) {
  return (
    <div className="pose-instruction-card" role="region" aria-label={`Instructions for ${step.name}`}>
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
        <span className="pose-card-requirement">{step.requirement}</span>
        <p className="pose-card-instruction">{step.instruction}</p>
      </div>

      <div className="pose-tips-section">
        <span className="pose-tips-heading">Alignment Coaching</span>
        <ul className="pose-tips-list">
          {step.tips.map((tip) => (
            <li key={tip} className="pose-tip-item">
              <span className="pose-tip-dot" aria-hidden="true" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {finishHint && (
        <div className="pose-disclaimer-subtext" role="note">
          <Info size={13} className="pose-disclaimer-icon" aria-hidden="true" />
          <span>{finishHint}</span>
        </div>
      )}

      <div className="pose-card-actions">
        <div className="pose-actions-nav">
          <Button variant="ghost" size="sm" icon={ArrowLeft} disabled={isFirstStep} onClick={onPrev}>
            Previous
          </Button>
          {isCaptured ? (
            <Button variant="outline" size="sm" icon={RotateCcw} onClick={onRetake}>
              Retake View
            </Button>
          ) : (
            <Button variant="ghost" size="sm" icon={SkipForward} onClick={onSkip} ariaLabel={`Skip ${step.name}`}>
              Skip View
            </Button>
          )}
        </div>

        {isLastStep ? (
          <Button variant="primary" size="md" icon={Sparkles} disabled={!canAnalyse} onClick={onAnalyse}>
            Analyse Photos
          </Button>
        ) : (
          <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={onNext}>
            Next View
          </Button>
        )}
      </div>
    </div>
  );
}
