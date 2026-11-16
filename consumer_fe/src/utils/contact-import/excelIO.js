import * as XLSX from 'xlsx';
import { HEADING_PREVIEW_ROW_COUNT, inspectHeadings, normalizeHeaderName } from './constants';
import { createRowUid, stripRowMeta } from './workbookValidation';

const SAMPLE_BY_KEY = {
  first_name: 'Ama',
  last_name: 'Mensah',
  phone_number: '233241234567',
  email: 'ama@example.com',
  gender: 'Female',
  region: 'Greater Accra',
  location: 'Accra',
  residential_location: 'Accra',
  residential_address: '12 Independence Ave',
  customer_type: 'Individual',
  date_of_birth: '1992-04-18',
  age_range: '25-34',
};

function templateHeader(column) {
  if (typeof column === 'string') return normalizeHeaderName(column);
  return normalizeHeaderName(column?.key || column?.label || '');
}

export function createContactTemplateWorkbook(columns = []) {
  const headers = columns.map(templateHeader).filter(Boolean);
  const sample = headers.map((key) => SAMPLE_BY_KEY[key] ?? '');
  const worksheet = XLSX.utils.aoa_to_sheet([headers, sample]);

  worksheet['!cols'] = headers.map((column) => ({
    wch: Math.max(16, column.length + 2),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
  return workbook;
}

export function downloadContactTemplate(fileName = 'engage360-contacts-template.xlsx', columns = []) {
  const workbook = createContactTemplateWorkbook(columns);
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

function formatPreviewCell(value) {
  if (value == null || value === '') return '';
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 0 });
  }
  return String(value);
}

export function buildHeadingPreview(rawHeaders = [], dataRows = []) {
  const headings = inspectHeadings(rawHeaders);
  const rows = dataRows.slice(0, HEADING_PREVIEW_ROW_COUNT).map((line, rowIndex) => ({
    rowNumber: rowIndex + 2,
    values: headings.map((heading) => formatPreviewCell(line?.[heading.index])),
  }));

  return {
    headings,
    rows,
    emptyCount: headings.filter((heading) => heading.empty).length,
    repeatedKeys: [...new Set(headings.filter((heading) => heading.repeated).map((heading) => heading.key))],
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
  const headingPreview = buildHeadingPreview(rawHeaders, matrix.slice(1));
  const { headerMap, columns, duplicates } = buildHeaderMap(rawHeaders);

  if (!rawHeaders.length) {
    throw new Error('Could not find a heading row in the first row of the file.');
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
    headingPreview,
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
