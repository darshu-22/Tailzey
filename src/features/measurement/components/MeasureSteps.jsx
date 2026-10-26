import React from 'react';
import { Check } from 'lucide-react';

const MEASURE_STEPS = ['Before you start', 'Capture', 'Analysing', 'Review'];

/** The four stages of the camera flow, with the current one highlighted. */
export default function MeasureSteps({ current }) {
  return (
    <ol className="measure-steps" aria-label="Measurement steps">
      {MEASURE_STEPS.map((label, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'todo';
        return (
          <li key={label} className={`measure-step is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="measure-step-index" aria-hidden="true">
              {state === 'done' ? <Check size={14} strokeWidth={3} /> : index + 1}
            </span>
            <span className="measure-step-label">{label}</span>
            {state === 'done' && <span className="sr-only">(done)</span>}
          </li>
        );
      })}
    </ol>
  );
}
