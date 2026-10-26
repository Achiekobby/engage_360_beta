import { OTHER_VALUE } from '../../ui/formControls';

/**
 * Form model for region + city.
 *  - region: a Ghana region, or OTHER_VALUE (then `regionOther` holds the typed region)
 *  - city:   a city of that region, or OTHER_VALUE (then `cityOther` holds the typed city)
 * When the region is custom there is no list of cities to offer, so the city is typed directly.
 */
export const EMPTY_LOCATION = Object.freeze({ region: '', regionOther: '', city: '', cityOther: '' });

const NAME_PATTERN = /^[\p{L}\p{N}\s.,'’&()/-]{2,60}$/u;

export const cleanCustomName = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const isValidName = (value) => NAME_PATTERN.test(cleanCustomName(value));

export const isCityCustom = (location) =>
  location.region === OTHER_VALUE || location.city === OTHER_VALUE;

/** Final strings to submit. */
export function resolveLocation(location) {
  const region =
    location.region === OTHER_VALUE ? cleanCustomName(location.regionOther) : location.region;
  const city = isCityCustom(location) ? cleanCustomName(location.cityOther) : location.city;
  return { region, city };
}

export function validateLocation(location) {
  const errors = {};

  if (!location.region) {
    errors.region = 'Select your region.';
  } else if (location.region === OTHER_VALUE && !isValidName(location.regionOther)) {
    errors.regionOther = 'Enter your region (2–60 letters or numbers).';
  }

  if (location.region && location.region !== OTHER_VALUE && !location.city) {
    errors.city = 'Select your city or town.';
  } else if (location.region && isCityCustom(location) && !isValidName(location.cityOther)) {
    errors.cityOther = 'Enter your city or town (2–60 letters or numbers).';
  }

  return errors;
}
