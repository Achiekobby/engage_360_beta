import { useState } from 'react';
import { ErrorMessage, Field, useField } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import PhoneInput from 'react-phone-number-input';

export const fieldLabelClass = 'mb-1.5 block text-sm font-medium text-[#0B1354]';
export const fieldInputClass =
  'w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] placeholder:text-[#A1A1AA] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15';
export const fieldErrorClass = 'mt-1 text-xs text-destructive';

export function FieldLabel({ htmlFor, children, required = false, optional = false, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={clsx(fieldLabelClass, className)}>
      {children}
      {required ? (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      ) : null}
      {optional ? <span className="ml-1.5 text-xs font-normal text-[#717171]">Optional</span> : null}
    </label>
  );
}

export function TextField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  optional = false,
  className = '',
}) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={name} required={required} optional={optional}>
        {label}
      </FieldLabel>
      <Field id={name} name={name} type={type} placeholder={placeholder} className={fieldInputClass} />
      <ErrorMessage name={name} component="p" className={fieldErrorClass} />
    </div>
  );
}

export function PhoneField({ name, label, required = false }) {
  const [field, meta, helpers] = useField(name);

  return (
    <div>
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
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
      {meta.touched && meta.error ? <p className={fieldErrorClass}>{meta.error}</p> : null}
    </div>
  );
}

export function PasswordField({ label, name, placeholder, required = false }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <Field
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete="new-password"
          className={`${fieldInputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded text-[#717171] hover:text-[#0B1354] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <ErrorMessage name={name} component="p" className={fieldErrorClass} />
    </div>
  );
}
