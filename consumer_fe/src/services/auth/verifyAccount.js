import { API_BASE_URL } from './config';

export class VerifyError extends Error {
  constructor(message, { status } = {}) {
    super(message);
    this.name = 'VerifyError';
    this.status = status;
  }
}

export async function verifyAccount({ email, code }) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/verify-account`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });
  } catch {
    throw new VerifyError('We could not reach the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const fieldMessage = data.errors?.code?.[0] || data.errors?.email?.[0];
    const message =
      response.status === 429
        ? 'Too many attempts. Wait a moment and try again.'
        : fieldMessage || data.message || 'That code could not be verified.';
    throw new VerifyError(message, { status: response.status });
  }

  return data;
}

export async function resendVerificationCode({ email }) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/resend-code`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  } catch {
    throw new VerifyError('We could not reach the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const fieldMessage = data.errors?.email?.[0];
    const message =
      response.status === 429
        ? 'Too many attempts. Wait a moment and try again.'
        : fieldMessage || data.message || 'A new code could not be sent.';
    throw new VerifyError(message, { status: response.status });
  }

  return data;
}
