/**
 * Normalised error for every failed API call.
 * `status` is 0 for network failures / timeouts (no HTTP response).
 */
export class ApiError extends Error {
  constructor({ status = 0, code = 'UNKNOWN_ERROR', message, fieldErrors = {}, requestId = null }) {
    super(message || 'Something went wrong. Please try again.');
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.requestId = requestId;
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isUnauthorized() {
    return this.status === 401;
  }
}

/** Human-readable message for any thrown value. */
export function getErrorMessage(error) {
  if (error instanceof ApiError) return error.message;
  return 'Something went wrong. Please try again.';
}
