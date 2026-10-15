/**
 * Runtime configuration read from Vite env variables.
 * Only public values belong here — never secrets (everything VITE_* ships to the browser).
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');

export const REQUEST_TIMEOUT_MS = 15_000;
export const ANALYSIS_TIMEOUT_MS = 90_000;
