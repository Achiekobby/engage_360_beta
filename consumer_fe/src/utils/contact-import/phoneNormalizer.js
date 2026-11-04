/**
 * Deterministic phone normalization only.
 * Does not invent digits or guess incomplete numbers.
 */
export function normalizePhoneNumber(rawValue) {
  if (rawValue == null || rawValue === '') {
    return {
      normalizedValue: '',
      changed: false,
      recoverable: true,
      reason: 'empty',
    };
  }

  let source = rawValue;

  if (typeof source === 'number') {
    if (!Number.isFinite(source)) {
      return {
        normalizedValue: '',
        changed: false,
        recoverable: false,
        reason: 'non_finite_number',
      };
    }
    // Avoid scientific notation digit loss for Excel-parsed phones.
    source = source.toLocaleString('en-US', {
      useGrouping: false,
      maximumFractionDigits: 0,
    });
  } else if (typeof source === 'boolean') {
    return {
      normalizedValue: '',
      changed: false,
      recoverable: false,
      reason: 'unsupported_type',
    };
  } else {
    source = String(source);
  }

  const original = source.trim();
  if (!original) {
    return {
      normalizedValue: '',
      changed: Boolean(String(rawValue).length && !original),
      recoverable: true,
      reason: 'empty',
    };
  }

  // Recover common Excel scientific notation strings.
  let working = original;
  if (/^\d+(\.\d+)?e[+\-]?\d+$/i.test(working)) {
    const asNumber = Number(working);
    if (Number.isFinite(asNumber)) {
      working = asNumber.toLocaleString('en-US', {
        useGrouping: false,
        maximumFractionDigits: 0,
      });
    }
  }

  // Drop trailing .0 from spreadsheet numeric strings.
  if (/^\d+\.0+$/.test(working)) {
    working = working.replace(/\.0+$/, '');
  }

  let normalized = working
    .replace(/[\s\-().]/g, '')
    .replace(/^\+/, '');

  // Keep digits only after harmless formatting removal.
  const digitsOnly = normalized.replace(/\D/g, '');
  const hadNonDigits = digitsOnly !== normalized;
  normalized = digitsOnly;

  return {
    normalizedValue: normalized,
    changed: normalized !== String(rawValue).trim() || hadNonDigits || original !== String(rawValue),
    recoverable: true,
    reason: 'normalized',
  };
}
