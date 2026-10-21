import { createOneEuroFilter } from './oneEuroFilter';

const LANDMARK_COUNT = 33;
const REFERENCE_HEIGHT = 720; // filter tuning is expressed in pixels of a 720p frame
const VISIBILITY_EASE = 0.35; // exponential smoothing of per-landmark visibility

/**
 * Smooths MediaPipe pose landmarks over time (One-Euro filter on x/y, exponential on
 * visibility) and converts them from normalised [0, 1] units to canvas pixels.
 */
export function createPoseSmoother() {
  const filters = Array.from({ length: LANDMARK_COUNT }, () => ({
    x: createOneEuroFilter(),
    y: createOneEuroFilter(),
  }));
  let visibility = new Array(LANDMARK_COUNT).fill(null);

  return {
    /**
     * @param {Array<{x,y,visibility}>} landmarks normalised landmarks of one person
     * @returns {Array<{x: number, y: number, v: number}>} smoothed points in pixels
     */
    smooth(landmarks, width, height, timeSec) {
      const toRef = REFERENCE_HEIGHT;
      return landmarks.slice(0, LANDMARK_COUNT).map((lm, i) => {
        const raw = lm.visibility ?? 1;
        const prev = visibility[i];
        visibility[i] = prev === null ? raw : prev + (raw - prev) * VISIBILITY_EASE;
        const x = filters[i].x.filter(lm.x * toRef, timeSec) / toRef;
        const y = filters[i].y.filter(lm.y * toRef, timeSec) / toRef;
        return { x: x * width, y: y * height, v: visibility[i] };
      });
    },
    reset() {
      filters.forEach((f) => {
        f.x.reset();
        f.y.reset();
      });
      visibility = new Array(LANDMARK_COUNT).fill(null);
    },
  };
}
