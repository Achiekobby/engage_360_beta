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
  COMPLETE: 'complete',
  FAILED: 'failed',
};

export function normalizeHeaderName(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
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
