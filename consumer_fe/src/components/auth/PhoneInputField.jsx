import PhoneInput from 'react-phone-number-input';
import { useField } from 'formik';
import AuthFieldLabel from './AuthFieldLabel';
import { authErrorClass } from './authStyles';

export default function PhoneInputField({
  name,
  label,
  className = '',
  required = false,
  optional = false,
}) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={className}>
      <AuthFieldLabel htmlFor={name} required={required} optional={optional}>
        {label}
      </AuthFieldLabel>
      <PhoneInput
        id={name}
        name={name}
        defaultCountry="GH"
        international
        countryCallingCodeEditable={false}
        placeholder="Enter phone number"
        value={field.value || undefined}
        onChange={(value) => helpers.setValue(value ?? '')}
        onBlur={() => helpers.setTouched(true)}
        className="auth-phone-input"
      />
      {meta.touched && meta.error ? (
        <p className={authErrorClass}>{meta.error}</p>
      ) : null}
    </div>
  );
}
