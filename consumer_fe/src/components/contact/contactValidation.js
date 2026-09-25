import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const contactSchema = Yup.object({
  companyName: Yup.string().trim().required('Company name is required'),
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .test('valid-phone', 'Enter a valid phone number', (value) =>
      value ? isValidPhoneNumber(value) : false,
    ),
});

export const CONTACT_INITIAL_VALUES = {
  companyName: '',
  email: '',
  phone: '',
};
