import React from 'react';
import { Check } from 'lucide-react';
import { DESIGNER_STEPS } from '../../../shared/data/designerData';

/**
 * DesignerStepper Component
 * Visual and accessible progress indicator for the 3-step design workflow:
 * 1. Choose Garment -> 2. Customize Style -> 3. Review Design
 */
export default function DesignerStepper({
  currentStep = 1,
  onStepChange,
  className = '',
}) {
  return (
    <nav
      className={`designer-stepper-container ${className}`.trim()}
      aria-label="Outfit Designer Progress"
    >
      <ol className="designer-stepper-list">
        {DESIGNER_STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <li
              key={step.id}
              className={`designer-step-item ${
                isCurrent ? 'is-current' : ''
              } ${isCompleted ? 'is-completed' : ''}`}
            >
              <button
                type="button"
                className="designer-step-btn"
                onClick={() => onStepChange && onStepChange(step.id)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${step.id}: ${step.title}. ${step.description}`}
              >
                <span className="designer-step-indicator" aria-hidden="true">
                  {isCompleted ? (
                    <Check size={14} strokeWidth={2.8} />
                  ) : (
                    <span className="designer-step-num">{step.id}</span>
                  )}
                </span>

                <div className="designer-step-text">
                  <span className="designer-step-title">{step.title}</span>
                  <span className="designer-step-sub">{step.description}</span>
                </div>
              </button>

              {step.id < DESIGNER_STEPS.length && (
                <div
                  className={`designer-step-connector ${
                    isCompleted ? 'is-filled' : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
