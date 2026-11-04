import * as XLSX from 'xlsx';
import {
  DEFAULT_CONTACT_COLUMNS,
  normalizeHeaderName,
} from './constants';
import { createRowUid, stripRowMeta } from './workbookValidation';

export function createContactTemplateWorkbook() {
  const worksheet = XLSX.utils.aoa_to_sheet([
    DEFAULT_CONTACT_COLUMNS,
    ['Ama', 'Mensah', 'ama@example.com', 'Female', 'Accra', '233241234567'],
  ]);

  worksheet['!cols'] = DEFAULT_CONTACT_COLUMNS.map((column) => ({
    wch: Math.max(14, column.length + 2),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
  return workbook;
}

export function downloadContactTemplate(fileName = 'engage360-contacts-template.xlsx') {
  const workbook = createContactTemplateWorkbook();
  XLSX.writeFile(workbook, fileName);
}

export function buildHeaderMap(rawHeaders = []) {
  const headerMap = {};
  const duplicates = [];
  const seen = new Map();

  rawHeaders.forEach((header, index) => {
    const canonical = normalizeHeaderName(header);
    if (!canonical) return;

    if (seen.has(canonical)) {
      duplicates.push(canonical);
      return;
    }

    seen.set(canonical, index);
    headerMap[canonical] = header;
  });

  return {
    headerMap,
    columns: [...seen.keys()],
    duplicates: [...new Set(duplicates)],
    rawHeaders,
  };
}

/**
 * Parse first sheet into canonical rows. Phone-like cells read as text when possible.
 */
export function parseWorkbookArrayBuffer(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellDates: true,
    raw: true,
  });

  const sheetName = workbook.SheetNames?.[0];
  if (!sheetName) {
    throw new Error('The Excel file does not contain any sheets.');
  }

  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: true,
    blankrows: true,
  });

  if (!matrix.length) {
    throw new Error('The Excel file is empty.');
  }

  const rawHeaders = (matrix[0] || []).map((value) =>
    value == null ? '' : String(value),
  );
  const { headerMap, columns, duplicates } = buildHeaderMap(rawHeaders);

  if (!columns.length) {
    throw new Error('Could not find any column headers in the first row.');
  }

  const rows = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const line = matrix[index] || [];
    const rawRow = {};
    rawHeaders.forEach((header, columnIndex) => {
      if (!header && header !== 0) return;
      rawRow[header] = line[columnIndex];
    });

    const canonical = {};
    Object.entries(headerMap).forEach(([canonicalKey, original]) => {
      let value = rawRow[original];
      if (typeof value === 'string') {
        // keep as-is; trim happens in validation/autofix
      } else if (typeof value === 'number' && canonicalKey === 'phone_number') {
        value = value.toLocaleString('en-US', {
          useGrouping: false,
          maximumFractionDigits: 0,
        });
      } else if (value instanceof Date) {
        value = value.toISOString();
      } else if (typeof value === 'boolean') {
        value = value ? 'true' : 'false';
      } else if (value == null) {
        value = '';
      }
      canonical[canonicalKey] = value;
    });

    rows.push({
      ...canonical,
      __uid: createRowUid(index),
    });
  }

  return {
    sheetName,
    columns,
    duplicates,
    rows,
    headerMap,
  };
}

export function workbookFromRows(columns, rows) {
  const plainRows = rows.map((row) => {
    const plain = stripRowMeta(row);
    const output = {};
    columns.forEach((column) => {
      output[column] = plain[column] ?? '';
    });
    return output;
  });

  const worksheet = XLSX.utils.json_to_sheet(plainRows, {
    header: columns,
  });
  worksheet['!cols'] = columns.map((column) => ({
    wch: Math.max(14, String(column).length + 2),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
  return workbook;
}

export function downloadWorkbook(workbook, fileName) {
  XLSX.writeFile(workbook, fileName);
}

export function workbookToArrayBuffer(workbook) {
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}
