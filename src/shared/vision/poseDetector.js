import { POSE_MODEL_URL, VISION_WASM_PATH } from '../../core/config/env';

/**
 * Create a PoseLandmarker in VIDEO mode, preferring the GPU delegate and falling back to
 * the CPU when WebGL is unavailable. `overrides` are merged into the task options.
 */
async function createDetector(overrides = {}) {
  // Loaded on demand so the ~1 MB vision bundle only ships to pages that use the camera.
  const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');
  const vision = await FilesetResolver.forVisionTasks(VISION_WASM_PATH);
  const options = (delegate) => ({
    baseOptions: { modelAssetPath: POSE_MODEL_URL, delegate },
    runningMode: 'VIDEO',
    numPoses: 2, // lets us warn when someone else is in frame
    minPoseDetectionConfidence: 0.5,
    minPosePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
    ...overrides,
  });
  try {
    return await PoseLandmarker.createFromOptions(vision, options('GPU'));
  } catch {
    return PoseLandmarker.createFromOptions(vision, options('CPU'));
  }
}

/** Memoise one detector per configuration; a failed load is forgotten so it can be retried. */
function memoised(factory) {
  let pending = null;
  return () => {
    if (!pending) {
      pending = factory().catch((err) => {
        pending = null; // allow a retry later
        throw err;
      });
    }
    return pending;
  };
}

/**
 * Shared in-browser pose landmarker (one per page). Frames are analysed locally on the
 * device — nothing is uploaded until a photo is actually captured and analysed.
 */
export const loadPoseDetector = memoised(() => createDetector());

/**
 * Single-person landmarker that also returns a person segmentation mask (used by the
 * live try-on to keep the garment inside the body silhouette). Runs on the device only.
 * Each VIDEO-mode landmarker needs strictly increasing timestamps, so this is a separate
 * instance from `loadPoseDetector()`.
 */
export const loadSegmentingPoseDetector = memoised(() =>
  createDetector({ numPoses: 1, outputSegmentationMasks: true })
);
