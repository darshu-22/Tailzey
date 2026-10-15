import { ApiError, getErrorMessage } from '../../../core/api/ApiError';

/**
 * Turn an analyzeMeasurements() failure into user-facing copy:
 * { title, message, details: string[], canRetry }. canRetry is false when resending
 * the same photos cannot succeed (validation or image problems).
 */
export function describeAnalysisError(error) {
  if (!(error instanceof ApiError)) {
    return { title: 'Analysis failed', message: getErrorMessage(error), details: [], canRetry: true };
  }
  const details = Object.values(error.fieldErrors || {});
  switch (true) {
    case error.isNetworkError:
      return { title: 'Could not reach the server', message: error.message, details: [], canRetry: true };
    case error.status === 422:
      return {
        title: 'Some details need fixing',
        message: 'The server could not use this submission.',
        details: details.length ? details : [error.message],
        canRetry: false,
      };
    case error.status === 413 || error.status === 415:
      return {
        title: 'A photo could not be accepted',
        message: `${error.message} Please retake that view.`,
        details: [],
        canRetry: false,
      };
    case error.status === 429:
      return {
        title: 'Too many attempts',
        message: 'You have run several analyses in a short time. Please wait a minute and try again.',
        details: [],
        canRetry: true,
      };
    case error.status === 503:
      return {
        title: 'Measurement service unavailable',
        message: `${error.message} You can enter your measurements manually in the meantime.`,
        details: [],
        canRetry: true,
      };
    default:
      return { title: 'Analysis failed', message: error.message, details, canRetry: true };
  }
}
