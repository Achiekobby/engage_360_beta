import { useMemo } from 'react';
import { GHANA_REGIONS, getLocationOptions } from '../../../constants/ghanaLocations';
import SearchableSelect from '../../ui/SearchableSelect';
import { FieldError, FieldLabel, OTHER_VALUE, fieldClass } from '../../ui/formControls';
import { EMPTY_LOCATION } from './locationModel';

function CustomInput({ id, value, onChange, placeholder, error, autoFocus = false }) {
  return (
    <div className="mt-2.5">
      <input
        id={id}
        type="text"
        value={value}
        autoFocus={autoFocus}
        maxLength={60}
        autoComplete="off"
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass(error, 'h-12')}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

/**
 * Region + city pickers. Both are searchable and end with an "Other" entry that reveals
 * a custom input. Cities are derived from the selected region; changing the region
 * clears the city so a stale combination can never be submitted.
 */
export default function LocationFields({ value, onChange, errors = {}, idPrefix = 'location' }) {
  const regionIsOther = value.region === OTHER_VALUE;
  const cityIsOther = value.city === OTHER_VALUE;
  const cities = useMemo(() => getLocationOptions(value.region), [value.region]);

  const update = (patch) => onChange({ ...EMPTY_LOCATION, ...value, ...patch });

  const handleRegion = (region) => {
    if (region === value.region) return;
    update({ region, city: '', cityOther: '', regionOther: region === OTHER_VALUE ? value.regionOther : '' });
  };

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor={`${idPrefix}-region`}>Region</FieldLabel>
        <SearchableSelect
          id={`${idPrefix}-region`}
          value={value.region}
          onChange={handleRegion}
          options={GHANA_REGIONS}
          placeholder="Select your region"
          searchPlaceholder="Search regions…"
          emptyMessage="No region found. Choose “Other” to type yours."
          allowOther
          error={Boolean(errors.region)}
          describedBy={errors.region ? `${idPrefix}-region-error` : undefined}
        />
        <FieldError id={`${idPrefix}-region-error`}>{errors.region}</FieldError>
        {regionIsOther ? (
          <CustomInput
            id={`${idPrefix}-region-other`}
            value={value.regionOther}
            onChange={(regionOther) => update({ regionOther })}
            placeholder="Type your region"
            error={errors.regionOther}
            autoFocus
          />
        ) : null}
      </div>

      <div>
        <FieldLabel htmlFor={regionIsOther ? `${idPrefix}-city-other` : `${idPrefix}-city`}>
          City / Town
        </FieldLabel>

        {regionIsOther ? (
          <CustomInput
            id={`${idPrefix}-city-other`}
            value={value.cityOther}
            onChange={(cityOther) => update({ cityOther })}
            placeholder="Type your city or town"
            error={errors.cityOther}
          />
        ) : (
          <>
            <SearchableSelect
              id={`${idPrefix}-city`}
              key={value.region || 'no-region'}
              value={value.city}
              onChange={(city) => update({ city, cityOther: city === OTHER_VALUE ? value.cityOther : '' })}
              options={cities}
              disabled={!value.region}
              placeholder={value.region ? 'Select your city or town' : 'Select a region first'}
              searchPlaceholder="Search cities and towns…"
              emptyMessage="No match. Choose “Other” to type yours."
              allowOther
              error={Boolean(errors.city)}
              describedBy={errors.city ? `${idPrefix}-city-error` : undefined}
            />
            <FieldError id={`${idPrefix}-city-error`}>{errors.city}</FieldError>
            {cityIsOther ? (
              <CustomInput
                id={`${idPrefix}-city-other`}
                value={value.cityOther}
                onChange={(cityOther) => update({ cityOther })}
                placeholder="Type your city or town"
                error={errors.cityOther}
                autoFocus
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
