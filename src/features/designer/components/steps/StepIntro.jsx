import React from 'react';
import StatusBadge from '../../../../shared/ui/StatusBadge';
import { DESIGNER_STEPS } from '../../../../shared/data/designerData';

/** Heading block shown at the top of each designer step. */
export default function StepIntro({ step, pill, title, description }) {
  return (
    <div className="designer-step-intro">
      <div className="step-intro-badges">
        <StatusBadge variant="gold" dot>
          Step {step} of {DESIGNER_STEPS.length}
        </StatusBadge>
        <span className="step-intro-pill">{pill}</span>
      </div>
      <h1 className="designer-step-heading">{title}</h1>
      <p className="designer-step-description">{description}</p>
    </div>
  );
}
