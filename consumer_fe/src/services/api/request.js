import { API_BASE_URL } from '../auth/config';

export class ApiError extends Error {
  constructor(message, { status, fieldErrors, data, retryAfterMs } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors || {};
    this.data = data;
    this.retryAfterMs = retryAfterMs || 0;
  }
}

function retryAfterMsFrom(response) {
  const header = response.headers?.get?.('Retry-After');
  if (!header) return 30000;
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 120000);
  const at = Date.parse(header);
  if (Number.isFinite(at)) return Math.min(Math.max(0, at - Date.now()), 120000);
  return 30000;
}

function fieldErrorsFrom(errors) {
  const fieldErrors = {};
  Object.entries(errors || {}).forEach(([key, messages]) => {
    const message = Array.isArray(messages) ? messages[0] : String(messages || '');
    if (message) fieldErrors[key] = message;
  });
  return fieldErrors;
}

function authHeaders(token, tokenType = 'Bearer') {
  if (!token) return {};
  return { Authorization: `${tokenType || 'Bearer'} ${token}` };
}

function throwIfFailed(response, data) {
  if (!response.ok || data.success === false) {
    const fieldErrors = fieldErrorsFrom(data.errors);
    const message =
      response.status === 429
        ? data.message || 'Too many requests. Wait a moment and try again.'
        : response.status === 401
          ? 'Your session has expired. Sign in again.'
          : Object.values(fieldErrors)[0] || data.message || 'Something went wrong. Please try again.';
    throw new ApiError(message, {
      status: response.status,
      fieldErrors,
      data,
      retryAfterMs: response.status === 429 ? retryAfterMsFrom(response) : 0,
    });
  }
}

export async function apiRequest(path, { method = 'GET', body, token, tokenType } = {}) {
  const headers = {
    Accept: 'application/json',
    ...authHeaders(token, tokenType),
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('We could not reach the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  throwIfFailed(response, data);
  return data;
}

/** Multipart upload. Do not set Content-Type so the browser can attach the boundary. */
export async function apiFormRequest(path, { method = 'POST', formData, token, tokenType } = {}) {
  const headers = {
    Accept: 'application/json',
    ...authHeaders(token, tokenType),
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: formData,
    });
  } catch {
    throw new ApiError('We could not reach the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  throwIfFailed(response, data);
  return data;
}
