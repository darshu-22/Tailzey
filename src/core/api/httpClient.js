import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/env';
import { ApiError } from './ApiError';

/**
 * Thin fetch wrapper used by every service module.
 * - Sends the HttpOnly session cookie (credentials: 'include').
 * - Maps the backend error envelope {error: {code, message, fieldErrors}} to ApiError.
 * - Converts network failures and timeouts into ApiError (status 0).
 * - Notifies subscribers on 401 so the auth layer can drop an expired session.
 */
const unauthorizedListeners = new Set();

export function onUnauthorized(listener) {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

async function parseBody(response) {
  if (response.status === 204) return null;
  const type = response.headers.get('content-type') || '';
  return type.includes('application/json') ? response.json() : null;
}

export async function request(path, { method = 'GET', body, formData, signal, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException('timeout', 'TimeoutError')), timeoutMs);
  const onAbort = () => controller.abort(signal.reason);
  signal?.addEventListener('abort', onAbort);

  const headers = {};
  let payload;
  if (formData) payload = formData; // browser sets the multipart boundary
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: payload,
      credentials: 'include',
      signal: controller.signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err; // caller cancelled — let it propagate as AbortError
    const timedOut = controller.signal.reason?.name === 'TimeoutError';
    throw new ApiError({
      code: timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
      message: timedOut
        ? 'The server took too long to respond. Please try again.'
        : 'Cannot reach the Tailzey server. Check your connection and try again.',
    });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }

  const data = await parseBody(response).catch(() => null);
  if (response.ok) return data;

  if (response.status === 401) unauthorizedListeners.forEach((fn) => fn());
  const err = data?.error || {};
  throw new ApiError({
    status: response.status,
    code: err.code,
    message: err.message,
    fieldErrors: err.fieldErrors,
    requestId: err.requestId || response.headers.get('x-request-id'),
  });
}

export const http = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  upload: (path, formData, options) => request(path, { ...options, method: 'POST', formData }),
};
