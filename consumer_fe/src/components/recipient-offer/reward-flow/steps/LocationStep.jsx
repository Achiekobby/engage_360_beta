import { useState } from 'react';
import { REWARDS_CONFIG } from '../../../../constants/rewardsConfig';
import { getErrorMessage, saveLocation } from '../../../../services/recipient';
import { FormAlert } from '../../../ui/formControls';
import LocationFields from '../../location/LocationFields';
import { EMPTY_LOCATION, resolveLocation, validateLocation } from '../../location/locationModel';
import { FlowBodyPanel, FlowHeader, PrimaryButton } from '../FlowChrome';

export default function LocationStep({ phone, onSaved, onClose }) {
  const [location, setLocation] = useState(EMPTY_LOCATION);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (next) => {
    setLocation(next);
    if (Object.keys(errors).length) setErrors({});
    if (formError) setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;

    const found = validateLocation(location);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    setBusy(true);
    setFormError('');
    try {
      const result = await saveLocation(phone, resolveLocation(location));
      onSaved(result);
    } catch (err) {
      setFormError(getErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <>
      <FlowHeader
        pill={`+${REWARDS_CONFIG.profilePoints} reward points`}
        title="Where are you based?"
        subtitle="Get offers and events happening near you."
        onClose={onClose}
      />
      <FlowBodyPanel>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <LocationFields value={location} onChange={handleChange} errors={errors} idPrefix="flow-location" />
          <FormAlert>{formError}</FormAlert>
          <PrimaryButton busy={busy} busyLabel="Saving…">
            Save and earn {REWARDS_CONFIG.profilePoints} points
          </PrimaryButton>
        </form>
      </FlowBodyPanel>
    </>
  );
}
