import { apiRequest } from '../api/request';
import { normalizeHeaderName } from '../../utils/contact-import/constants';

export const STANDARD_FIELD_KEYS = ['first_name', 'last_name', 'phone_number'];

const STANDARD_LABELS = {
  first_name: 'First name',
  last_name: 'Last name',
  phone_number: 'Phone number',
};

const EXCLUSIVE_PAIRS = {
  date_of_birth: 'age_range',
  age_range: 'date_of_birth',
};

const GROUP_ALIASES = {
  standard: 'standard',
  required: 'standard',
  mandatory: 'standard',
  core: 'standard',
  recommended: 'recommended',
  optional: 'recommended',
  suggested: 'recommended',
  custom: 'custom',
  company: 'custom',
  additional: 'custom',
};

export const STANDARD_FIELDS = STANDARD_FIELD_KEYS.map((key) => ({
  key,
  label: STANDARD_LABELS[key],
  group: 'standard',
  required: true,
}));

/** Used only when GET /api/contact-fields fails. */
export const RECOMMENDED_FIELDS = [
  { key: 'email', label: 'Email', group: 'recommended' },
  { key: 'date_of_birth', label: 'Date of birth', group: 'recommended', exclusiveWith: 'age_range' },
  { key: 'age_range', label: 'Age range', group: 'recommended', exclusiveWith: 'date_of_birth' },
  { key: 'gender', label: 'Gender', group: 'recommended' },
  { key: 'region', label: 'Region', group: 'recommended' },
  { key: 'residential_location', label: 'Residential location', group: 'recommended' },
  { key: 'residential_address', label: 'Residential address', group: 'recommended' },
  { key: 'customer_type', label: 'Customer type', group: 'recommended' },
  { key: 'religion', label: 'Religion', group: 'recommended', sensitive: true },
];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function readKey(field) {
  if (typeof field === 'string') return normalizeHeaderName(field);
  const raw = field?.key ?? field?.field_key ?? field?.slug ?? field?.column ?? '';
  return normalizeHeaderName(raw);
}

function readLabel(field, key) {
  if (typeof field === 'object' && field) {
    const label = field.label || field.display_name || field.title;
    if (label && String(label).trim()) return String(label).trim();
  }
  if (STANDARD_LABELS[key]) return STANDARD_LABELS[key];
  return key
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function readId(field) {
  if (typeof field !== 'object' || !field) return null;
  const id =
    field.id ??
    field.field_id ??
    field.contact_field_id ??
    field.column_id ??
    field.uuid ??
    null;
  return id == null || id === '' ? null : String(id);
}

function readDataType(field) {
  if (typeof field !== 'object' || !field) return 'string';
  if (field.data_type) return String(field.data_type);
  if (field.field_type) return String(field.field_type);
  const raw = String(field.type || 'string').toLowerCase();
  if (GROUP_ALIASES[raw]) return 'string';
  return raw || 'string';
}

/**
 * API uses category: standard | optional | custom.
 * `type` is the data type (string, email, phone, date, select), not the group.
 */
function readGroup(field, fallback = 'custom') {
  const key = readKey(field);
  if (STANDARD_FIELD_KEYS.includes(key)) return 'standard';

  const category = String(
    (typeof field === 'object' && field && (field.category || field.group || field.field_group)) ||
      '',
  ).toLowerCase();
  if (GROUP_ALIASES[category]) return GROUP_ALIASES[category];

  const typeValue = String((typeof field === 'object' && field?.type) || '').toLowerCase();
  if (GROUP_ALIASES[typeValue]) return GROUP_ALIASES[typeValue];

  return GROUP_ALIASES[String(fallback || '').toLowerCase()] || 'custom';
}

function listFromPayload(payload) {
  const data = payload?.data ?? payload ?? {};
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.fields)) return data.fields;
  if (Array.isArray(data.contact_fields)) return data.contact_fields;
  if (Array.isArray(data.columns)) return data.columns;

  return [
    ...asArray(data.standard || data.standard_fields || data.required || data.mandatory),
    ...asArray(data.recommended || data.recommended_fields || data.optional),
    ...asArray(data.custom || data.custom_fields),
  ];
}

function toChoice(field, key, group) {
  const exclusiveWith =
    (typeof field === 'object' && (field?.exclusive_with || field?.mutually_exclusive_with)) ||
    EXCLUSIVE_PAIRS[key] ||
    null;
  const options = typeof field === 'object' && Array.isArray(field?.options) ? field.options : null;

  return {
    id: readId(field),
    key,
    label: readLabel(field, key),
    type: readDataType(field),
    group,
    required: group === 'standard' || Boolean(field?.is_required || field?.required),
    enabled: field?.is_enabled !== false && field?.enabled !== false,
    sensitive: key === 'religion' || Boolean(field?.sensitive),
    exclusiveWith: exclusiveWith ? normalizeHeaderName(exclusiveWith) : null,
    options,
  };
}

export function fieldFromCustomResponse(payload) {
  const data = payload?.data ?? payload ?? {};
  const key = readKey(data);
  if (!key) return null;
  return {
    ...toChoice(data, key, 'custom'),
    required: false,
    group: 'custom',
  };
}

/**
 * Available columns from GET /api/contact-fields.
 * Shape: { success, data: [{ id, key, label, type, category, ... }] }
 * category "optional" is shown as recommended choices.
 */
export function catalogFromContactFields(payload) {
  const fields = listFromPayload(payload).filter((field) => field && typeof field === 'object');
  const standard = new Map(STANDARD_FIELDS.map((field) => [field.key, { ...field, id: null }]));
  const recommended = [];
  const custom = [];
  const seen = new Set();

  fields.forEach((field) => {
    const key = readKey(field);
    if (!key || seen.has(key)) return;
    seen.add(key);

    const group = readGroup(field);
    if (group === 'standard') {
      if (!standard.has(key)) return;
      standard.set(key, {
        ...standard.get(key),
        ...toChoice(field, key, 'standard'),
        group: 'standard',
        required: true,
      });
      return;
    }

    const choice = toChoice(field, key, group);
    if (group === 'recommended') recommended.push(choice);
    else custom.push(choice);
  });

  return {
    standard: STANDARD_FIELD_KEYS.map((key) => standard.get(key)),
    recommended,
    custom,
  };
}

let contactFieldsCache = null;
let contactFieldsCachedAt = 0;
let contactFieldsInFlight = null;
const CONTACT_FIELDS_CACHE_MS = 1000 * 60 * 5;

export function rememberContactField(field) {
  if (!contactFieldsCache || !field?.key) return;
  const custom = contactFieldsCache.custom || [];
  if (custom.some((item) => item.key === field.key)) return;
  contactFieldsCache = {
    ...contactFieldsCache,
    custom: [...custom, field],
  };
}

export async function getContactFields({ token, tokenType, force = false } = {}) {
  const now = Date.now();
  if (!force && contactFieldsCache && now - contactFieldsCachedAt < CONTACT_FIELDS_CACHE_MS) {
    return contactFieldsCache;
  }
  if (!force && contactFieldsInFlight) return contactFieldsInFlight;

  contactFieldsInFlight = apiRequest('/api/contact-fields', { token, tokenType })
    .then((result) => {
      contactFieldsCache = catalogFromContactFields(result);
      contactFieldsCachedAt = Date.now();
      return contactFieldsCache;
    })
    .finally(() => {
      contactFieldsInFlight = null;
    });

  return contactFieldsInFlight;
}

export async function createCustomContactField(
  { key, label, type = 'string' } = {},
  { token, tokenType } = {},
) {
  const result = await apiRequest('/api/contact-fields/custom', {
    method: 'POST',
    token,
    tokenType,
    body: {
      key: normalizeHeaderName(key),
      label: String(label || '').trim(),
      type: type || 'string',
    },
  });
  const field = fieldFromCustomResponse(result);
  if (!field?.key) {
    throw new Error('Custom column was created, but the server response was incomplete.');
  }
  return field;
}

export async function saveContactFieldsConfiguration(columnIds = [], { token, tokenType } = {}) {
  const ids = [...new Set((columnIds || []).map((id) => String(id)).filter(Boolean))];
  if (!ids.length) {
    throw new Error('Select at least one column before saving the configuration.');
  }
  return apiRequest('/api/contact-fields/configuration', {
    method: 'PUT',
    token,
    tokenType,
    body: { column_ids: ids },
  });
}
