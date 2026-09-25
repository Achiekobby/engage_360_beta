import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';

const phoneField = (label) =>
  Yup.string()
    .required(`${label} is required`)
    .test('valid-phone', 'Enter a valid phone number', (value) =>
      value ? isValidPhoneNumber(value) : false,
    );

export const companySchema = Yup.object({
  companyName: Yup.string().trim().required('Company name is required'),
  companyPhone: phoneField('Phone number'),
  companyEmail: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  contactPersonName: Yup.string().trim().required('Contact person name is required'),
  contactPhone: phoneField('Phone number'),
  contactEmail: Yup.string().trim().email('Enter a valid email').required('Email is required'),
});

const socialLinkSchema = Yup.object({
  platform: Yup.string(),
  url: Yup.string(),
}).test('social-pair', 'Add both a platform and a valid link', function validatePair(value) {
  const platform = value?.platform?.trim() ?? '';
  const url = value?.url?.trim() ?? '';
  if (!platform && !url) return true;
  if (!platform) {
    return this.createError({
      path: `${this.path}.platform`,
      message: 'Select a platform',
    });
  }
  if (!url) {
    return this.createError({
      path: `${this.path}.url`,
      message: 'Add a link',
    });
  }
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('invalid');
    }
  } catch {
    return this.createError({
      path: `${this.path}.url`,
      message: 'Enter a valid URL',
    });
  }
  return true;
});

export const profileSchema = Yup.object({
  socialLinks: Yup.array().of(socialLinkSchema),
});

export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'At least 8 characters',
    message: 'Use at least 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    id: 'lower',
    label: 'A lowercase letter',
    message: 'Add a lowercase letter',
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: 'upper',
    label: 'An uppercase letter',
    message: 'Add an uppercase letter',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'number',
    label: 'A number',
    message: 'Add a number',
    test: (value) => /\d/.test(value),
  },
  {
    id: 'symbol',
    label: 'A symbol',
    message: 'Add a symbol',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

export const PASSWORD_STRENGTH = [
  { id: 'empty', label: '', bars: 0, bar: 'bg-[#E8EAEF]', text: 'text-[#717171]' },
  { id: 'weak', label: 'Weak', bars: 1, bar: 'bg-[#EF4444]', text: 'text-[#B91C1C]' },
  { id: 'fair', label: 'Fair', bars: 2, bar: 'bg-[#F59E0B]', text: 'text-[#B45309]' },
  { id: 'good', label: 'Good', bars: 3, bar: 'bg-primary', text: 'text-primary' },
  { id: 'strong', label: 'Strong', bars: 4, bar: 'bg-[#1F9D55]', text: 'text-[#157A42]' },
];

export function passwordStrength(value) {
  const password = value ?? '';
  const met = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  if (!password) return PASSWORD_STRENGTH[0];
  if (met <= 2) return PASSWORD_STRENGTH[1];
  if (met === 3) return PASSWORD_STRENGTH[2];
  if (met === 4) return PASSWORD_STRENGTH[3];
  return PASSWORD_STRENGTH[4];
}

function withPasswordRules(schema) {
  return PASSWORD_RULES.reduce(
    (current, rule) => current.test(rule.id, rule.message, (value) => Boolean(value) && rule.test(value)),
    schema,
  );
}

export const accessSchema = Yup.object({
  password: withPasswordRules(Yup.string().required('Password is required')),
  confirmPassword: withPasswordRules(
    Yup.string()
      .required('Confirm the password')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  ),
});

export const STEP_SCHEMAS = [companySchema, profileSchema, accessSchema];

export async function collectStepErrors(schema, values) {
  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (error) {
    const errors = {};
    const issues = error.inner?.length ? error.inner : [error];
    issues.forEach((issue) => {
      if (issue.path && !errors[issue.path]) errors[issue.path] = issue.message;
    });
    return errors;
  }
}
