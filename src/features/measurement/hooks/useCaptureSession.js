import { useCallback, useMemo, useState } from 'react';
import { CAPTURE_STEPS } from '../../../shared/data/measurementData';

const LAST_INDEX = CAPTURE_STEPS.length - 1;
const STEP_INDEX = Object.fromEntries(CAPTURE_STEPS.map((s, i) => [s.key, i]));

const without = (map, key) => {
  const { [key]: _removed, ...rest } = map;
  return rest;
};

/**
 * State of the guided photo sequence. Captured photos are JPEG data URLs held only
 * in this component state: they are never persisted and are dropped with clear()
 * or when the page unmounts.
 */
export function useCaptureSession() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState({});
  const [skipped, setSkipped] = useState({});

  const activeStep = CAPTURE_STEPS[activeIndex];

  const goTo = useCallback((index) => setActiveIndex(Math.max(0, Math.min(LAST_INDEX, index))), []);
  const next = useCallback(() => setActiveIndex((i) => Math.min(LAST_INDEX, i + 1)), []);
  const prev = useCallback(() => setActiveIndex((i) => Math.max(0, i - 1)), []);

  const capture = useCallback(
    (dataUrl) => {
      setImages((m) => ({ ...m, [activeStep.key]: dataUrl }));
      setSkipped((m) => without(m, activeStep.key));
      next();
    },
    [activeStep.key, next]
  );

  const skip = useCallback(() => {
    setSkipped((m) => ({ ...m, [activeStep.key]: true }));
    next();
  }, [activeStep.key, next]);

  /** Discard one view's photo and make it the active step. */
  const retake = useCallback((key) => {
    setImages((m) => without(m, key));
    setSkipped((m) => without(m, key));
    if (key in STEP_INDEX) setActiveIndex(STEP_INDEX[key]);
  }, []);

  /** Drop every captured photo and start the sequence again. */
  const clear = useCallback(() => {
    setImages({});
    setSkipped({});
    setActiveIndex(0);
  }, []);

  return useMemo(
    () => ({
      steps: CAPTURE_STEPS,
      activeIndex,
      activeStep,
      isLastStep: activeIndex === LAST_INDEX,
      images,
      skipped,
      capturedCount: Object.keys(images).length,
      skippedCount: Object.keys(skipped).length,
      canAnalyse: Boolean(images.front || images.back),
      hasSideView: Boolean(images['left-side'] || images['right-side']),
      goTo,
      next,
      prev,
      capture,
      skip,
      retake,
      clear,
    }),
    [activeIndex, activeStep, images, skipped, goTo, next, prev, capture, skip, retake, clear]
  );
}
