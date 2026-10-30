import { postAuth } from './request';

function loginData(result) {
  const data = result?.data;
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
}

export function sessionFromLogin(result, fallbackEmail) {
  const data = loginData(result);
  const company = data.company && typeof data.company === 'object' ? data.company : {};

  return {
    id: company.id || null,
    email: company.company_email || fallbackEmail,
    name: company.company_name || '',
    phone: company.company_phone || '',
    companyId: company.id || null,
    logo: company.company_logo || null,
    emailVerifiedAt: company.email_verified_at || null,
    token: data.access_token || null,
    tokenType: data.token_type || null,
    expiresAt: data.expires_at || null,
  };
}

/** A successful login still needs verification when the company email has not been confirmed. */
export function accountNeedsVerification(result) {
  const company = loginData(result).company;
  if (!company || typeof company !== 'object') return false;
  return !company.email_verified_at;
}

/**
 * Verification returns the same company and token payload as login.
 * Success means the account is verified, even when email_verified_at is still empty.
 */
export function sessionFromVerification(result, fallbackEmail) {
  const session = sessionFromLogin(result, fallbackEmail);
  return {
    ...session,
    emailVerifiedAt: session.emailVerifiedAt || new Date().toISOString(),
  };
}

export async function loginAccount({ email, password }) {
  return postAuth('/api/auth/login', {
    email: email.trim(),
    password,
  });
}
