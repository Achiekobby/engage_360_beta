import { API_BASE_URL } from './config';

const FIELD_MAP = {
  company_name: 'companyName',
  company_phone: 'companyPhone',
  company_email: 'companyEmail',
  contact_person_name: 'contactPersonName',
  contact_phone: 'contactPhone',
  contact_email: 'contactEmail',
  company_logo: 'companyLogo',
  password: 'password',
  password_confirmation: 'confirmPassword',
};

export class RegisterError extends Error {
  constructor(message, { status, fieldErrors, flat } = {}) {
    super(message);
    this.name = 'RegisterError';
    this.status = status;
    this.fieldErrors = fieldErrors || {};
    this.flat = flat || {};
  }
}

function nestFieldErrors(flat) {
  const nested = {};
  Object.entries(flat).forEach(([path, message]) => {
    const parts = path.split('.');
    let cursor = nested;
    parts.forEach((part, index) => {
      const last = index === parts.length - 1;
      if (last) {
        cursor[part] = message;
        return;
      }
      const nextIsIndex = /^\d+$/.test(parts[index + 1]);
      if (cursor[part] == null) cursor[part] = nextIsIndex ? [] : {};
      cursor = cursor[part];
    });
  });
  return nested;
}

export function mapRegisterErrors(errors) {
  const flat = {};
  Object.entries(errors || {}).forEach(([key, messages]) => {
    const message = Array.isArray(messages) ? messages[0] : String(messages || '');
    if (!message) return;
    const social = key.match(/^social_links\.(\d+)\.(platform|url)$/);
    if (social) {
      flat[`socialLinks.${social[1]}.${social[2]}`] = message;
      return;
    }
    const field = FIELD_MAP[key];
    if (field) flat[field] = message;
  });
  return { flat, nested: nestFieldErrors(flat) };
}

/** Multipart body. The logo has to be a file; the other fields match /api/auth/register. */
export function buildRegisterFormData(values) {
  const body = new FormData();
  body.append('company_name', values.companyName.trim());
  body.append('company_phone', values.companyPhone);
  body.append('company_email', values.companyEmail.trim());
  body.append('contact_person_name', values.contactPersonName.trim());
  body.append('contact_phone', values.contactPhone);
  body.append('contact_email', values.contactEmail.trim());
  body.append('password', values.password);
  body.append('password_confirmation', values.confirmPassword);

  if (values.companyLogo instanceof File) {
    body.append('company_logo', values.companyLogo);
  }

  (values.socialLinks || [])
    .filter((link) => link?.url?.trim())
    .forEach((link, index) => {
      body.append(`social_links[${index}][platform]`, (link.platform || '').trim());
      body.append(`social_links[${index}][url]`, link.url.trim());
    });

  return body;
}

export function stepForRegisterErrors(flat) {
  const keys = Object.keys(flat);
  if (!keys.length) return 2;
  const stepFor = (key) => {
    if (key.startsWith('socialLinks') || key === 'companyLogo') return 1;
    if (key === 'password' || key === 'confirmPassword') return 2;
    return 0;
  };
  return Math.min(...keys.map(stepFor));
}

export async function registerAccount(values) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: buildRegisterFormData(values),
    });
  } catch {
    throw new RegisterError('We could not reach the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const { flat, nested } = mapRegisterErrors(data.errors);
    const message =
      response.status === 429
        ? 'Too many attempts. Wait a moment and try again.'
        : data.message || 'Registration could not be completed.';
    throw new RegisterError(message, { status: response.status, fieldErrors: nested, flat });
  }

  return data;
}
