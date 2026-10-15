import React from 'react';
import { ArrowLeft, Ruler, Sparkles } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import CaptureStepper from './CaptureStepper';
import CameraPreview from './CameraPreview';
import PoseInstructionCard from './PoseInstructionCard';

function getFinishHint({ canAnalyse, hasSideView }) {
  if (!canAnalyse) return 'A front or back photo is required before your photos can be analysed.';
  if (!hasSideView) return 'Without a side photo, neck, chest, waist and hip cannot be measured.';
  return null;
}

/** Guided capture: pose stepper, live viewfinder and instructions for the active view. */
export default function CaptureScreen({ session, onAnalyse, onBackToSetup, onSwitchToManual }) {
  const { activeStep, images, skipped } = session;
  const finishHint = getFinishHint(session);

  return (
    <section className="capture-flow-section" aria-label="Guided Camera Capture Flow">
      <CaptureStepper
        steps={session.steps}
        activeStepIndex={session.activeIndex}
        capturedImages={images}
        skippedSteps={skipped}
        onSelectStep={session.goTo}
        onRetakeStep={session.retake}
      />

      <div className="capture-workspace-grid">
        <div className="capture-viewfinder-column">
          <CameraPreview
            activeStep={activeStep}
            onCaptureFrame={session.capture}
            onSwitchToManual={onSwitchToManual}
          />
        </div>

        <div className="capture-instructions-column">
          <PoseInstructionCard
            step={activeStep}
            totalSteps={session.steps.length}
            isFirstStep={session.activeIndex === 0}
            isLastStep={session.isLastStep}
            isCaptured={Boolean(images[activeStep.key])}
            isSkipped={Boolean(skipped[activeStep.key])}
            canAnalyse={session.canAnalyse}
            finishHint={session.isLastStep ? finishHint : null}
            onPrev={session.prev}
            onNext={session.next}
            onSkip={session.skip}
            onRetake={() => session.retake(activeStep.key)}
            onAnalyse={onAnalyse}
          />

          <div className="capture-helper-nav">
            <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBackToSetup}>
              Back to Setup
            </Button>
            {session.canAnalyse && !session.isLastStep && (
              <Button variant="outline" size="sm" icon={Sparkles} onClick={onAnalyse}>
                Analyse {session.capturedCount} Photo{session.capturedCount === 1 ? '' : 's'}
              </Button>
            )}
            <Button variant="ghost" size="sm" icon={Ruler} onClick={onSwitchToManual}>
              Switch to Manual Entry
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
