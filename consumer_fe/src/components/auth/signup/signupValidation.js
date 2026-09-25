import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';

const phoneField = (label = 'Phone number') =>
  Yup.string()
    .required(`${label} is required`)
    .test('valid-phone', 'Enter a valid phone number', (value) =>
      value ? isValidPhoneNumber(value) : false,
    );

export const step1Schema = Yup.object({
  companyName: Yup.string().trim().required('Company name is required'),
  companyPhone: phoneField('Phone number'),
  companyEmail: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  contactPersonName: Yup.string().trim().required('Contact person name is required'),
  contactPhone: phoneField('Phone number'),
  contactEmail: Yup.string().trim().email('Enter a valid email').required('Email is required'),
});

export const step2Schema = Yup.object({
  socialLinks: Yup.array().of(
    Yup.object({
      platform: Yup.string(),
      url: Yup.string()
        .transform((value) => (value === '' ? undefined : value))
        .url('Enter a valid URL')
        .notRequired(),
    }),
  ),
});

export const step3Schema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export const STEP_SCHEMAS = [step1Schema, step2Schema, step3Schema];
