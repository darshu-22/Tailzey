import React from 'react';
import CaptureThumbnail from './CaptureThumbnail';
import { CAPTURE_STEPS } from '../../data/measurementData';

/**
 * CaptureStepper Component
 * Visual horizontal bar tracking progress across the six guided capture poses.
 */
export default function CaptureStepper({
  activeStepIndex = 0,
  capturedImages = {},
  skippedSteps = {},
  onSelectStep,
  onRetakeStep,
  className = '',
}) {
  const capturedCount = Object.keys(capturedImages).length;
  const skippedCount = Object.keys(skippedSteps).length;

  return (
    <nav
      className={`capture-stepper-bar ${className}`.trim()}
      aria-label="Guided Capture Poses Progress"
    >
      <div className="capture-stepper-header">
        <div className="stepper-count-wrap">
          <span className="stepper-title">Guided Poses</span>
          <span className="stepper-counter">
            <strong>{capturedCount}</strong> of {CAPTURE_STEPS.length} Captured
            {skippedCount > 0 && ` (${skippedCount} Skipped)`}
          </span>
        </div>
      </div>

      <div className="capture-thumbnails-scroll-container">
        <div className="capture-thumbnails-track">
          {CAPTURE_STEPS.map((step, idx) => (
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
