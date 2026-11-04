import { ISSUE_TYPES, PHONE_NUMBER_PATTERN } from './constants';
import { normalizePhoneNumber } from './phoneNormalizer';

export function validatePhoneNumber(rawValue, { rowNumber, normalize = true } = {}) {
  const normalization = normalize
    ? normalizePhoneNumber(rawValue)
    : {
        normalizedValue: String(rawValue ?? '').trim(),
        changed: false,
        recoverable: true,
      };

  const value = normalization.normalizedValue;

  if (!value) {
    return {
      valid: false,
      normalizedValue: '',
      normalization,
      issues: [
        {
          rowNumber,
          column: 'phone_number',
          value: rawValue ?? '',
          type: ISSUE_TYPES.MISSING_PHONE_NUMBER,
          message: 'Phone number is required for every contact row.',
          autoFixable: false,
        },
      ],
    };
  }

  if (!/^\d+$/.test(value)) {
    return {
      valid: false,
      normalizedValue: value,
      normalization,
      issues: [
        {
          rowNumber,
          column: 'phone_number',
          value: rawValue,
          type: ISSUE_TYPES.INVALID_PHONE_CHARS,
          message: 'Phone number must contain digits only after formatting is removed.',
          autoFixable: Boolean(normalization.changed && PHONE_NUMBER_PATTERN.test(value)),
        },
      ],
    };
  }

  if (!value.startsWith('233')) {
    return {
      valid: false,
      normalizedValue: value,
      normalization,
      issues: [
        {
          rowNumber,
          column: 'phone_number',
          value: rawValue,
          type: ISSUE_TYPES.INVALID_PHONE_PREFIX,
          message: 'Phone number must start with 233.',
          autoFixable: false,
        },
      ],
    };
  }

  if (value.length !== 12) {
    return {
      valid: false,
      normalizedValue: value,
      normalization,
      issues: [
        {
          rowNumber,
          column: 'phone_number',
          value: rawValue,
          type: ISSUE_TYPES.INVALID_PHONE_LENGTH,
          message: 'Phone number must be exactly 12 digits (233 + 9 digits).',
          autoFixable: false,
        },
      ],
    };
  }

  if (!PHONE_NUMBER_PATTERN.test(value)) {
    return {
      valid: false,
      normalizedValue: value,
      normalization,
      issues: [
        {
          rowNumber,
          column: 'phone_number',
          value: rawValue,
          type: ISSUE_TYPES.INVALID_PHONE_CHARS,
          message: 'Phone number format is invalid.',
          autoFixable: false,
        },
      ],
    };
  }

  return {
    valid: true,
    normalizedValue: value,
    normalization,
    issues: [],
  };
}
