import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ErrorMessage, Field } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import AuthFieldLabel from './AuthFieldLabel';
import { authErrorClass, authInputClass } from './authStyles';

export default function PasswordField({
  label,
  name,
  placeholder = 'Enter password',
  showForgotLink = false,
  forgotLinkTo = '/forgot-password',
  required = false,
  optional = false,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <AuthFieldLabel htmlFor={name} required={required} optional={optional} className="mb-0">
          {label}
        </AuthFieldLabel>
        {showForgotLink ? (
          <Link
            to={forgotLinkTo}
            className="text-xs font-medium text-primary hover:text-primary/80"
          >
            Forgot password?
          </Link>
        ) : null}
      </div>
      <div className="relative">
        <Field
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          className={`${authInputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717171] hover:text-[#0B1354] cursor-pointer"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <ErrorMessage name={name} component="p" className={authErrorClass} />
    </div>
  );
}
