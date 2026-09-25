import { useFormikContext } from 'formik';
import { Check, Circle } from 'lucide-react';
import { PasswordField } from './fields';
import { PASSWORD_RULES, passwordStrength } from './onboardingValidation';

function PasswordRuleList({ value, password, labelledBy, showMatch = false }) {
  const checks = PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    met: rule.test(value ?? ''),
    attention: false,
  }));

  if (showMatch) {
    checks.push({
      id: 'match',
      label: 'Matches password',
      met: Boolean(value) && value === password,
      attention: Boolean(value) && value !== password,
    });
  }

  return (
    <ul aria-labelledby={labelledBy} className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
      {checks.map((check) => (
        <li
          key={check.id}
          className={`flex items-center gap-1.5 text-xs ${
            check.met ? 'text-[#157A42]' : check.attention ? 'text-[#B45309]' : 'text-[#717171]'
          }`}
        >
          {check.met ? (
            <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <Circle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          <span className="sr-only">{check.met ? 'Met: ' : 'Not met: '}</span>
          {check.label}
        </li>
      ))}
    </ul>
  );
}

function PasswordStrength({ value }) {
  const strength = passwordStrength(value);

  return (
    <div className="mt-2.5">
      <div
        className="flex items-center gap-2"
        role="meter"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={strength.bars}
        aria-valuetext={strength.label || 'No password entered'}
      >
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {[1, 2, 3, 4].map((segment) => (
            <span
              key={segment}
              className={`h-1 flex-1 rounded-full ${segment <= strength.bars ? strength.bar : 'bg-[#E8EAEF]'}`}
            />
          ))}
        </div>
        <span className={`w-12 text-right text-[11px] font-semibold ${strength.text}`} aria-hidden="true">
          {strength.label}
        </span>
      </div>
    </div>
  );
}

export default function AccessStep() {
  const { values } = useFormikContext();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0B1354]">Account access</h2>
        <p className="mt-1 text-sm text-[#717171]">
          Set the password yourself. {values.companyName || 'The business'} can sign in with{' '}
          <span className="font-medium text-[#0B1354]">{values.companyEmail || 'the company email'}</span>.
          No verification code is sent.
        </p>
      </div>

      <dl className="grid gap-3 rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] px-4 py-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-[#717171]">Business</dt>
          <dd className="mt-0.5 font-medium text-[#0B1354]">{values.companyName || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#717171]">Sign-in email</dt>
          <dd className="mt-0.5 break-all font-medium text-[#0B1354]">{values.companyEmail || '—'}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-[#717171]">Primary contact</dt>
          <dd className="mt-0.5 font-medium text-[#0B1354]">
            {values.contactPersonName || '—'}
            {values.contactEmail ? ` · ${values.contactEmail}` : ''}
          </dd>
        </div>
      </dl>

      <div>
        <PasswordField label="Password" name="password" placeholder="Create a password" required />
        <PasswordStrength value={values.password} />
        <p id="password-rules" className="sr-only">
          Password requirements
        </p>
        <PasswordRuleList value={values.password} labelledBy="password-rules" />
      </div>
      <div>
        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          placeholder="Confirm the password"
          required
        />
        <p id="confirm-password-rules" className="sr-only">
          Confirm password requirements
        </p>
        <PasswordRuleList
          value={values.confirmPassword}
          password={values.password}
          labelledBy="confirm-password-rules"
          showMatch
        />
      </div>
    </div>
  );
}
