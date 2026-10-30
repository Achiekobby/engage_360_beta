import { API_BASE_URL } from './config';

export class AuthError extends Error {
  constructor(message, { status, fieldErrors, data } = {}) {
    super(message);
    this.name = 'AuthError';
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

export async function postAuth(path, body) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthError('We could not reach the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const fieldErrors = fieldErrorsFrom(data.errors);
    const message =
      response.status === 429
        ? 'Too many attempts. Wait a moment and try again.'
        : Object.values(fieldErrors)[0] || data.message || 'Something went wrong. Please try again.';
    throw new AuthError(message, { status: response.status, fieldErrors, data });
  }

  return data;
}
