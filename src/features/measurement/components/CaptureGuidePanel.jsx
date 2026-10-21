import React from 'react';
import { ArrowLeft, ArrowRight, Info, RotateCcw, SkipForward, Sparkles } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import ViewProgressList from './ViewProgressList';

function finishHint({ canAnalyse, hasSideView }) {
  if (!canAnalyse) return 'A front or back photo is needed before your photos can be analysed.';
  if (!hasSideView) return 'Without a side photo, neck, chest, waist and hip can’t be measured.';
  return null;
}

/**
 * Guidance for the active view (what to do, tips), the four-view progress, and the
 * sequence actions. On the last view the primary action sends the photos for analysis.
 */
export default function CaptureGuidePanel({ session, handsFree, onAnalyse }) {
  const { activeStep: step, steps, images, skipped, isLastStep } = session;
  const isCaptured = Boolean(images[step.key]);
  const isSkipped = Boolean(skipped[step.key]);
  const hint = isLastStep ? finishHint(session) : null;
  const photoCount = session.capturedCount;

  return (
    <aside className="capture-panel" aria-labelledby="capture-step-title">
      <ViewProgressList steps={steps} activeIndex={session.activeIndex} images={images} skipped={skipped} onSelect={session.goTo} />

      <div className="capture-panel-step">
        <div className="cluster">
          <span className="capture-panel-count">
            View {step.id} of {steps.length}
          </span>
          {isCaptured && <StatusBadge variant="success">Captured</StatusBadge>}
          {isSkipped && <StatusBadge variant="neutral">Skipped</StatusBadge>}
        </div>
        <h2 id="capture-step-title" className="capture-panel-title">
          {step.name}
        </h2>
        <p className="capture-panel-requirement">{step.requirement}</p>
        <p className="capture-panel-instruction">{step.instruction}</p>
        <ul className="capture-tips">
          {step.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        {handsFree && !isCaptured && (
          <p className="capture-panel-note">Get into position. The photo is taken automatically when you hold still.</p>
        )}
      </div>

      {hint && (
        <p className="measure-alert is-info" role="note">
          <Info size={16} aria-hidden="true" />
          <span>{hint}</span>
        </p>
      )}

      <div className="capture-panel-actions">
        <div className="capture-panel-nav">
          <Button variant="ghost" size="sm" icon={ArrowLeft} disabled={session.activeIndex === 0} onClick={session.prev}>
            Previous
          </Button>
          {isCaptured ? (
            <Button variant="outline" size="sm" icon={RotateCcw} onClick={() => session.retake(step.key)}>
              Retake
            </Button>
          ) : (
            <Button variant="ghost" size="sm" icon={SkipForward} onClick={session.skip} ariaLabel={`Skip ${step.name}`}>
              Skip
            </Button>
          )}
        </div>
        {isLastStep ? (
          <Button icon={Sparkles} disabled={!session.canAnalyse} onClick={onAnalyse} className="capture-panel-primary">
            Analyse photos
          </Button>
        ) : (
          <Button icon={ArrowRight} iconPosition="right" onClick={session.next} className="capture-panel-primary">
            Next view
          </Button>
        )}
        {session.canAnalyse && !isLastStep && (
          <Button variant="outline" icon={Sparkles} onClick={onAnalyse} className="capture-panel-primary">
            Analyse {photoCount} photo{photoCount === 1 ? '' : 's'} now
          </Button>
        )}
      </div>
    </aside>
  );
}
