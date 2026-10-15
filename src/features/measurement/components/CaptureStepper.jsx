import React from 'react';
import CaptureThumbnail from './CaptureThumbnail';

/** Horizontal progress track across the guided capture views. */
export default function CaptureStepper({
  steps,
  activeStepIndex,
  capturedImages,
  skippedSteps,
  onSelectStep,
  onRetakeStep,
}) {
  const capturedCount = Object.keys(capturedImages).length;
  const skippedCount = Object.keys(skippedSteps).length;

  return (
    <nav className="capture-stepper-bar" aria-label="Guided Capture Poses Progress">
      <div className="capture-stepper-header">
        <div className="stepper-count-wrap">
          <span className="stepper-title">Guided Poses</span>
          <span className="stepper-counter">
            <strong>{capturedCount}</strong> of {steps.length} Captured
            {skippedCount > 0 && ` (${skippedCount} Skipped)`}
          </span>
        </div>
      </div>

      <div className="capture-thumbnails-scroll-container">
        <div className="capture-thumbnails-track">
          {steps.map((step, idx) => (
            <CaptureThumbnail
              key={step.key}
              step={step}
              isCurrent={idx === activeStepIndex}
              capturedImage={capturedImages[step.key]}
              isSkipped={Boolean(skippedSteps[step.key])}
              onClick={() => onSelectStep(idx)}
              onRetake={() => onRetakeStep(step.key)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
