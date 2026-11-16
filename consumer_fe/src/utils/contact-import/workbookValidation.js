import {
  BLOCKING_ISSUE_TYPES,
  DEFAULT_CONTACT_COLUMNS,
  ISSUE_TYPES,
  normalizeHeaderName,
  splitColumns,
} from './constants';
import { normalizePhoneNumber } from './phoneNormalizer';
import { validatePhoneNumber } from './phoneValidator';

function cellIsEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
}

export function isRowEmpty(row, columns) {
  return columns.every((column) => cellIsEmpty(row?.[column]));
}

export function createRowUid(index = 0) {
  return `r-${index}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ensureRowUid(row, index = 0) {
  if (row?.__uid) return row;
  return { ...row, __uid: createRowUid(index) };
}

export function detectDuplicateHeaders(rawHeaders = []) {
  const seen = new Map();
  const duplicates = [];

  rawHeaders.forEach((header, index) => {
    const normalized = normalizeHeaderName(header);
    if (!normalized) return;
    if (seen.has(normalized)) {
      duplicates.push({
        column: normalized,
        indexes: [seen.get(normalized), index],
      });
    } else {
      seen.set(normalized, index);
    }
  });

  return duplicates;
}

/**
 * Validate a workbook already parsed into canonical column keys.
 * `rows` are data rows only (no header). Excel row numbers use header = 1.
 */
export function validateWorkbook({ columns, rows, duplicateColumns = [], emptyHeadings = [] }) {
  const issues = [];
  emptyHeadings.forEach((heading) => {
    const columnNumber = (heading.index ?? 0) + 1;
    issues.push({
      rowNumber: 1,
      column: `column_${columnNumber}`,
      value: '',
      type: ISSUE_TYPES.EMPTY_HEADING,
      message: `Column ${columnNumber} has an empty heading. Name it or remove it before uploading.`,
      autoFixable: false,
    });
  });

  const normalizedColumns = columns.map((column) => normalizeHeaderName(column));
  const { customColumns } = splitColumns(normalizedColumns);

  const duplicateSet = new Set(
    [...duplicateColumns, ...normalizedColumns.filter((column, index) =>
      column && normalizedColumns.indexOf(column) !== index,
    )].map((column) => normalizeHeaderName(column)),
  );

  duplicateSet.forEach((column) => {
    if (!column) return;
    issues.push({
      rowNumber: 1,
      column,
      value: column,
      type: ISSUE_TYPES.DUPLICATE_COLUMN,
      message: `Duplicate column "${column}" found. Rename or remove the duplicate header.`,
      autoFixable: false,
    });
  });

  if (!normalizedColumns.includes('phone_number')) {
    issues.push({
      rowNumber: 1,
      column: 'phone_number',
      type: ISSUE_TYPES.MISSING_PHONE_COLUMN,
      message: 'The spreadsheet must include a phone_number column.',
      autoFixable: false,
    });

    return buildResult({
      rows: [],
      normalizedColumns,
      customColumns,
      issues,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      emptyRows: 0,
      phonesNormalized: 0,
    });
  }

  if (!rows.length) {
    issues.push({
      rowNumber: 1,
      type: ISSUE_TYPES.EMPTY_WORKBOOK,
      message: 'The spreadsheet has headers but no contact rows.',
      autoFixable: false,
    });

    return buildResult({
      rows: [],
      normalizedColumns,
      customColumns,
      issues,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      emptyRows: 0,
      phonesNormalized: 0,
    });
  }

  let lastPopulatedIndex = -1;
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (!isRowEmpty(rows[index], normalizedColumns)) {
      lastPopulatedIndex = index;
      break;
    }
  }

  const activeRows = lastPopulatedIndex >= 0 ? rows.slice(0, lastPopulatedIndex + 1) : [];
  let emptyRows = 0;
  let validRows = 0;
  let invalidRows = 0;
  let phonesNormalized = 0;
  const cleanedRows = [];

  activeRows.forEach((row, index) => {
    // Data-row index starts at 1 (header row is never counted).
    const rowNumber = index + 1;
    // Excel sheet row remains available for locating the line in the file.
    const excelRowNumber = index + 2;
    const withUid = ensureRowUid(row, index);
    const rowUid = withUid.__uid;
    const empty = isRowEmpty(withUid, normalizedColumns);

    if (empty) {
      emptyRows += 1;
      issues.push({
        rowNumber,
        excelRowNumber,
        rowUid,
        column: undefined,
        value: '',
        type: ISSUE_TYPES.EMPTY_ROW,
        message: 'Empty row between contacts. It can be removed automatically.',
        autoFixable: true,
      });
      cleanedRows.push({
        ...withUid,
        __rowNumber: rowNumber,
        __excelRowNumber: excelRowNumber,
        __empty: true,
        __valid: false,
      });
      return;
    }

    const phoneResult = validatePhoneNumber(withUid.phone_number, { rowNumber });
    const nextRow = {
      ...withUid,
      __rowNumber: rowNumber,
      __excelRowNumber: excelRowNumber,
      __empty: false,
    };

    if (phoneResult.valid) {
      if (phoneResult.normalization?.changed) {
        nextRow.phone_number = phoneResult.normalizedValue;
        phonesNormalized += 1;
      } else {
        nextRow.phone_number = phoneResult.normalizedValue;
      }
      nextRow.__valid = true;
      validRows += 1;
      cleanedRows.push(nextRow);
      return;
    }

    issues.push(
      ...phoneResult.issues.map((issue) => ({
        ...issue,
        rowNumber,
        excelRowNumber,
        rowUid,
      })),
    );
    nextRow.__valid = false;
    invalidRows += 1;
    cleanedRows.push(nextRow);
  });

  // Total = data rows only (never includes the Excel header row).
  const populatedRows = activeRows.filter((row) => !isRowEmpty(row, normalizedColumns)).length;

  return buildResult({
    rows: cleanedRows,
    normalizedColumns,
    customColumns,
    issues,
    totalRows: populatedRows,
    validRows,
    invalidRows,
    emptyRows,
    phonesNormalized,
  });
}

function buildResult({
  rows,
  normalizedColumns,
  customColumns,
  issues,
  totalRows,
  validRows,
  invalidRows,
  emptyRows,
  phonesNormalized,
}) {
  const blockingIssueCount = issues.filter((issue) =>
    BLOCKING_ISSUE_TYPES.has(issue.type),
  ).length;
  const autoFixableCount = issues.filter((issue) => issue.autoFixable).length;
  const readyToImport =
    totalRows > 0 &&
    blockingIssueCount === 0 &&
    emptyRows === 0 &&
    invalidRows === 0 &&
    validRows > 0 &&
    !issues.some((issue) => issue.type === ISSUE_TYPES.DUPLICATE_COLUMN);

  return {
    totalRows,
    validRows,
    invalidRows,
    emptyRows,
    phonesNormalized,
    columns: normalizedColumns,
    customColumns,
    defaultColumns: DEFAULT_CONTACT_COLUMNS.filter((column) =>
      normalizedColumns.includes(column),
    ),
    issues,
    blockingIssueCount,
    autoFixableCount,
    readyToImport,
    rows,
  };
}

/**
 * Apply safe automatic fixes and return a new workbook snapshot.
 */
export function autoFixWorkbook({ columns, rows }) {
  const normalizedColumns = columns.map((column) => normalizeHeaderName(column));

  const nextRows = [];
  let phonesNormalized = 0;
  let emptyRowsRemoved = 0;
  let cellsTrimmed = 0;

  rows.forEach((row, index) => {
    const withUid = ensureRowUid(row, index);
    const empty = isRowEmpty(withUid, normalizedColumns) || withUid.__empty;

    if (empty) {
      emptyRowsRemoved += 1;
      return;
    }

    const next = toSessionRow(withUid);

    normalizedColumns.forEach((column) => {
      const value = next[column];
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== value) {
          next[column] = trimmed;
          cellsTrimmed += 1;
        }
      }
    });

    if (Object.prototype.hasOwnProperty.call(next, 'phone_number')) {
      const normalization = normalizePhoneNumber(next.phone_number);
      if (normalization.normalizedValue) {
        const check = validatePhoneNumber(normalization.normalizedValue, {
          rowNumber: index + 2,
          normalize: false,
        });
        if (check.valid && normalization.changed) {
          next.phone_number = normalization.normalizedValue;
          phonesNormalized += 1;
        } else if (check.valid) {
          next.phone_number = normalization.normalizedValue;
        }
      }
    }

    nextRows.push(next);
  });

  const validation = validateWorkbook({
    columns: normalizedColumns,
    rows: nextRows,
  });

  return {
    columns: normalizedColumns,
    rows: validation.rows,
    validation,
    fixSummary: {
      phonesNormalized,
      emptyRowsRemoved,
      cellsTrimmed,
    },
  };
}

export function stripRowMeta(row = {}, { keepUid = false } = {}) {
  const next = { ...row };
  delete next.__rowNumber;
  delete next.__excelRowNumber;
  delete next.__empty;
  delete next.__valid;
  delete next.__pendingPhone;
  if (!keepUid) delete next.__uid;
  return next;
}

/** Keep stable identity for worker session mutations. */
export function toSessionRow(row = {}) {
  const uid = row.__uid;
  const plain = stripRowMeta(row, { keepUid: true });
  return uid ? { ...plain, __uid: uid } : plain;
}

export function toImportContacts(rows = [], columns = []) {
  const { customColumns } = splitColumns(columns);

  return rows
    .filter((row) => !row.__empty && !isRowEmpty(row, columns))
    .map((row) => {
      const plain = stripRowMeta(row);
      const contact = {
        first_name: plain.first_name ?? '',
        last_name: plain.last_name ?? '',
        email: plain.email ?? '',
        gender: plain.gender ?? '',
        location: plain.location ?? '',
        phone_number: String(plain.phone_number ?? ''),
      };

      const custom_fields = {};
      customColumns.forEach((column) => {
        custom_fields[column] =
          plain[column] == null || plain[column] === '' ? null : plain[column];
      });

      if (customColumns.length) {
        contact.custom_fields = custom_fields;
      }

      return contact;
    });
}

export function updateRowInWorkbook({ columns, rows, rowNumber, rowUid, patch }) {
  const targetNumber = rowNumber == null ? null : Number(rowNumber);
  const targetUid = rowUid != null ? String(rowUid) : null;

  const nextRows = rows.map((row, index) => {
    const currentNumber = Number(row.__rowNumber || index + 1);
    const currentUid = row.__uid != null ? String(row.__uid) : null;
    const isMatch =
      (targetUid && currentUid && currentUid === targetUid) ||
      (targetNumber != null && currentNumber === targetNumber);

    if (!isMatch) return toSessionRow(row);

    return toSessionRow({
      ...row,
      ...patch,
      __uid: currentUid || targetUid || createRowUid(index),
    });
  });

  return validateWorkbook({ columns, rows: nextRows });
}

export function removeRowsFromWorkbook({ columns, rows, rowNumbers = [], rowUids = [] }) {
  const numberSet = new Set(
    (Array.isArray(rowNumbers) ? rowNumbers : [])
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value)),
  );
  const uidSet = new Set(
    (Array.isArray(rowUids) ? rowUids : [])
      .filter((value) => value != null && value !== '')
      .map((value) => String(value)),
  );

  const nextRows = rows
    .map((row, index) => ({
      row,
      index,
      rowNumber: Number(row.__rowNumber || index + 1),
      rowUid: row.__uid != null ? String(row.__uid) : null,
    }))
    .filter((entry) => {
      if (entry.rowUid && uidSet.has(entry.rowUid)) return false;
      if (numberSet.has(entry.rowNumber)) return false;
      return true;
    })
    .map((entry) => toSessionRow(entry.row));

  return validateWorkbook({ columns, rows: nextRows });
}
