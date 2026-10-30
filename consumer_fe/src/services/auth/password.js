import { postAuth } from './request';

export async function forgotPassword({ email }) {
  return postAuth('/api/auth/forgot-password', {
    email: email.trim(),
  });
}

export async function resetPassword({ email, code, password }) {
  return postAuth('/api/auth/reset-password', {
    email: email.trim(),
    code,
    password,
  });
}
