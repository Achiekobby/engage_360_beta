import { API_BASE_URL } from '../auth/config';

export class ApiError extends Error {
  constructor(message, { status, fieldErrors, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors || {};
    this.data = data;
  }
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
  if (!response.ok || data.success === false) {
    const fieldErrors = fieldErrorsFrom(data.errors);
    const message =
      response.status === 429
        ? data.message || 'Too many requests. Wait a moment and try again.'
        : response.status === 401
          ? 'Your session has expired. Sign in again.'
          : Object.values(fieldErrors)[0] || data.message || 'Something went wrong. Please try again.';
    throw new ApiError(message, { status: response.status, fieldErrors, data });
  }

  return data;
}
