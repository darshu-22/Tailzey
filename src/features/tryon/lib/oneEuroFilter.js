/**
 * One-Euro filter (Casiez et al., CHI 2012): a low-pass filter whose cutoff rises with
 * speed, so a still body is steady (no jitter) while fast movement has little lag.
 */
const smoothingFactor = (cutoffHz, dtSec) => {
  const tau = 1 / (2 * Math.PI * cutoffHz);
  return 1 / (1 + tau / dtSec);
};

export function createOneEuroFilter({ minCutoff = 1.2, beta = 0.012, derivativeCutoff = 1 } = {}) {
  let prevValue = null;
  let prevDerivative = 0;
  let prevTime = 0;

  return {
    /** Filter `value` sampled at `timeSec`; returns the smoothed value. */
    filter(value, timeSec) {
      if (prevValue === null || timeSec <= prevTime) {
        prevValue = value;
        prevTime = timeSec;
        return value;
      }
      const dt = timeSec - prevTime;
      const derivative = (value - prevValue) / dt;
      const aD = smoothingFactor(derivativeCutoff, dt);
      prevDerivative = aD * derivative + (1 - aD) * prevDerivative;
      const cutoff = minCutoff + beta * Math.abs(prevDerivative);
      const a = smoothingFactor(cutoff, dt);
      prevValue = a * value + (1 - a) * prevValue;
      prevTime = timeSec;
      return prevValue;
    },
    reset() {
      prevValue = null;
      prevDerivative = 0;
      prevTime = 0;
    },
  };
}
