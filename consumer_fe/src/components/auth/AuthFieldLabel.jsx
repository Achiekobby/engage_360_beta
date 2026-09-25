import { clsx } from 'clsx';
import { authLabelClass } from './authStyles';

export default function AuthFieldLabel({
  htmlFor,
  children,
  required = false,
  optional = false,
  className = '',
}) {
  return (
    <label htmlFor={htmlFor} className={clsx(authLabelClass, className)}>
      {children}
      {required ? (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      ) : null}
      {optional ? (
        <span className="ml-1.5 text-xs font-normal text-[#717171]">(Optional)</span>
      ) : null}
    </label>
  );
}
