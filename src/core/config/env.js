/**
 * Runtime configuration read from Vite env variables.
 * Only public values belong here — never secrets (everything VITE_* ships to the browser).
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');

export const REQUEST_TIMEOUT_MS = 15_000;
export const ANALYSIS_TIMEOUT_MS = 90_000;

// In-browser pose detection for hands-free capture (self-hosted by scripts/prepare-vision-assets.mjs).
export const VISION_WASM_PATH = import.meta.env.VITE_VISION_WASM_PATH || '/mediapipe/wasm';
export const POSE_MODEL_URL = import.meta.env.VITE_POSE_MODEL_URL || '/mediapipe/pose_landmarker_lite.task';

// 3D studio mannequin and garments (built by backend/scripts/build_mannequin.py, served from public/).
export const MANNEQUIN_ASSETS_PATH = import.meta.env.VITE_MANNEQUIN_ASSETS_PATH || '/models/mannequin';
