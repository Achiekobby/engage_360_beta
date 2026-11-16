export const DEFAULT_CONTACT_COLUMNS = [
  'first_name',
  'last_name',
  'email',
  'gender',
  'location',
  'phone_number',
];

export const REQUIRED_CONTACT_COLUMNS = ['phone_number'];

export const PHONE_NUMBER_PATTERN = /^233\d{9}$/;

export const ACCEPTED_EXCEL_EXTENSIONS = ['.xlsx', '.xls'];

export const ACCEPTED_EXCEL_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/octet-stream',
];

export const ISSUE_TYPES = {
  MISSING_PHONE_NUMBER: 'missing_phone_number',
  INVALID_PHONE_PREFIX: 'invalid_phone_prefix',
  INVALID_PHONE_LENGTH: 'invalid_phone_length',
  INVALID_PHONE_CHARS: 'invalid_phone_chars',
  EMPTY_ROW: 'empty_row',
  DUPLICATE_COLUMN: 'duplicate_column',
  EMPTY_HEADING: 'empty_heading',
  MISSING_PHONE_COLUMN: 'missing_phone_column',
  INVALID_FILE: 'invalid_file',
  EMPTY_WORKBOOK: 'empty_workbook',
};

export const BLOCKING_ISSUE_TYPES = new Set([
  ISSUE_TYPES.MISSING_PHONE_NUMBER,
  ISSUE_TYPES.INVALID_PHONE_PREFIX,
  ISSUE_TYPES.INVALID_PHONE_LENGTH,
  ISSUE_TYPES.INVALID_PHONE_CHARS,
  ISSUE_TYPES.EMPTY_ROW,
  ISSUE_TYPES.DUPLICATE_COLUMN,
  ISSUE_TYPES.EMPTY_HEADING,
  ISSUE_TYPES.MISSING_PHONE_COLUMN,
  ISSUE_TYPES.INVALID_FILE,
  ISSUE_TYPES.EMPTY_WORKBOOK,
]);

export const IMPORT_STATUSES = {
  IDLE: 'idle',
  READY: 'ready',
  PARSING: 'parsing',
  VALIDATING: 'validating',
  VALID: 'valid',
  NEEDS_ATTENTION: 'needs_attention',
  FIXING: 'fixing',
  READY_TO_UPLOAD: 'ready_to_upload',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  FAILED: 'failed',
};

/** Server statuses from GET /api/contacts/uploads/{upload_id}. */
export const CONTACT_UPLOAD_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  PARTIAL: 'partial',
  FAILED: 'failed',
};

export function normalizeContactUploadStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase();
}

export function isContactUploadInProgress(status) {
  const normalized = normalizeContactUploadStatus(status);
  return (
    normalized === CONTACT_UPLOAD_STATUSES.PENDING ||
    normalized === CONTACT_UPLOAD_STATUSES.PROCESSING
  );
}

export function isContactUploadTerminal(status) {
  const normalized = normalizeContactUploadStatus(status);
  return (
    normalized === CONTACT_UPLOAD_STATUSES.COMPLETED ||
    normalized === CONTACT_UPLOAD_STATUSES.PARTIAL ||
    normalized === CONTACT_UPLOAD_STATUSES.FAILED
  );
}

/** Match the backend heading rule: "First Name" → first_name, "Mobile Number" → mobile_number. */
export function normalizeHeaderName(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

export const HEADING_PREVIEW_ROW_COUNT = 5;

export function inspectHeadings(rawHeaders = []) {
  const keys = rawHeaders.map((header) => normalizeHeaderName(header));
  const counts = new Map();
  keys.forEach((key) => {
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return rawHeaders.map((raw, index) => {
    const key = keys[index];
    return {
      index,
      raw: String(raw ?? '').trim(),
      key,
      empty: !key,
      repeated: Boolean(key) && counts.get(key) > 1,
    };
  });
}

export function isDefaultColumn(column) {
  return DEFAULT_CONTACT_COLUMNS.includes(normalizeHeaderName(column));
}

export function splitColumns(columns = []) {
  const normalized = columns.map((column) => normalizeHeaderName(column)).filter(Boolean);
  const defaults = DEFAULT_CONTACT_COLUMNS.filter((column) => normalized.includes(column));
  const customColumns = normalized.filter((column) => !DEFAULT_CONTACT_COLUMNS.includes(column));
  return { defaults, customColumns, all: normalized };
}
