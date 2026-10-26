import { useState } from 'react';
import { INTEREST_OPTIONS } from '../../../../constants/recipientProfileOptions';
import { REWARDS_CONFIG } from '../../../../constants/rewardsConfig';
import { getErrorMessage, saveDetails } from '../../../../services/recipient';
import SearchableSelect from '../../../ui/SearchableSelect';
import { FieldError, FieldLabel, FormAlert, fieldClass } from '../../../ui/formControls';
import { FlowBodyPanel, FlowHeader, PrimaryButton } from '../FlowChrome';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function DetailsStep({ phone, onSaved, onClose }) {
  const [interests, setInterests] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const clearError = (field) => {
    setFormError('');
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;

    const found = {};
    if (!interests) found.interests = 'Choose what you’re most interested in.';
    if (!EMAIL_PATTERN.test(email.trim())) found.email = 'Enter a valid email address.';
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    setBusy(true);
    setFormError('');
    try {
      const result = await saveDetails(phone, { interests, email });
      onSaved(result);
    } catch (err) {
      if (err.code === 'EMAIL_TAKEN' || err.code === 'INVALID_EMAIL') {
        setErrors({ email: getErrorMessage(err) });
      } else {
        setFormError(getErrorMessage(err));
      }
      setBusy(false);
    }
  };

  return (
    <>
      <FlowHeader
        pill={`+${REWARDS_CONFIG.profilePoints} reward points`}
        title="Tell us what you like"
        subtitle="We’ll send you offers you’ll actually care about."
        onClose={onClose}
      />
      <FlowBodyPanel>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <FieldLabel htmlFor="flow-interests">Interests</FieldLabel>
            <SearchableSelect
              id="flow-interests"
              value={interests}
              onChange={(next) => {
                setInterests(next);
                clearError('interests');
              }}
              options={INTEREST_OPTIONS}
              placeholder="Select an interest"
              searchPlaceholder="Search interests…"
              error={Boolean(errors.interests)}
              describedBy={errors.interests ? 'flow-interests-error' : undefined}
            />
            <FieldError id="flow-interests-error">{errors.interests}</FieldError>
          </div>

          <div>
            <FieldLabel htmlFor="flow-email">Email address</FieldLabel>
            <input
              id="flow-email"
              type="email"
              autoComplete="email"
              value={email}
              maxLength={120}
              placeholder="you@example.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'flow-email-error' : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError('email');
              }}
              className={fieldClass(errors.email, 'h-12')}
            />
            <FieldError id="flow-email-error">{errors.email}</FieldError>
          </div>

          <FormAlert>{formError}</FormAlert>
          <PrimaryButton busy={busy} busyLabel="Saving…">
            Save and earn {REWARDS_CONFIG.profilePoints} points
          </PrimaryButton>
        </form>
      </FlowBodyPanel>
    </>
  );
}
