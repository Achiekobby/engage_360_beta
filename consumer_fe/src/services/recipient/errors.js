/** Typed error so the UI can branch on `code` and show `message` directly. */
export class RecipientError extends Error {
  constructor(code, message, meta = {}) {
    super(message);
    this.name = 'RecipientError';
    this.code = code;
    this.meta = meta;
  }
}

export const isSessionExpired = (error) => error?.code === 'SESSION_EXPIRED';

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error instanceof RecipientError ? error.message : fallback;
