import { useCallback, useState } from 'react';
import { DESIGNER_STEPS } from '../../../shared/data/designerData';

export const STEP = Object.freeze({ GARMENT: 1, CUSTOMIZE: 2, REVIEW: 3 });

/** Local wizard position for the designer (1 = garment, 2 = customise, 3 = review). */
export function useDesignerSteps(initialStep = STEP.GARMENT) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const goTo = useCallback((step) => {
    const clamped = Math.min(Math.max(step, 1), DESIGNER_STEPS.length);
    setCurrentStep(clamped);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { currentStep, goTo, total: DESIGNER_STEPS.length };
}
