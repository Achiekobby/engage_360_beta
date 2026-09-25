import * as XLSX from 'xlsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,}$/;
const MAX_REPORTED_ERRORS = 8;

const NAME_HEADERS = ['name', 'full name', 'customer name', 'customer'];
const PHONE_HEADERS = ['phone', 'phone number', 'mobile', 'mobile number', 'contact'];
const EMAIL_HEADERS = ['email', 'email address'];

function normalizeHeader(header) {
  return String(header || '').trim().toLowerCase();
}

function findColumnIndex(headers, candidates) {
  return headers.findIndex((header) => candidates.includes(normalizeHeader(header)));
}

self.onmessage = (event) => {
  const { fileName, buffer } = event.data || {};

  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      self.postMessage({ status: 'error', message: 'This workbook has no sheets to read.' });
      return;
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: '' });

    if (rows.length === 0) {
      self.postMessage({ status: 'error', message: 'This sheet is empty.' });
      return;
    }

    const headers = rows[0].map((header) => String(header || '').trim());
    const nameIndex = findColumnIndex(headers, NAME_HEADERS);
    const phoneIndex = findColumnIndex(headers, PHONE_HEADERS);
    const emailIndex = findColumnIndex(headers, EMAIL_HEADERS);

    if (nameIndex === -1 || (phoneIndex === -1 && emailIndex === -1)) {
      self.postMessage({
        status: 'error',
        message:
          'Missing required columns. Your sheet needs a Name column and a Phone or Email column.',
        headers,
      });
      return;
    }

    const dataRows = rows.slice(1);
    let validRows = 0;
    const errors = [];

    dataRows.forEach((row, index) => {
      const rowNumber = index + 2;
      const name = String(row[nameIndex] ?? '').trim();
      const phone = phoneIndex !== -1 ? String(row[phoneIndex] ?? '').trim() : '';
      const email = emailIndex !== -1 ? String(row[emailIndex] ?? '').trim() : '';

      const hasName = Boolean(name);
      const hasValidPhone = Boolean(phone) && PHONE_PATTERN.test(phone);
      const hasValidEmail = Boolean(email) && EMAIL_PATTERN.test(email);
      const hasContact = hasValidPhone || hasValidEmail;

      if (hasName && hasContact) {
        validRows += 1;
        return;
      }

      if (errors.length < MAX_REPORTED_ERRORS) {
        let reason = 'Missing a valid phone number or email address.';
        if (!hasName) reason = 'Missing customer name.';
        else if (phone && !hasValidPhone && !hasValidEmail) reason = 'Phone number format looks invalid.';
        else if (email && !hasValidEmail && !hasValidPhone) reason = 'Email address format looks invalid.';

        errors.push({ row: rowNumber, reason });
      }
    });

    self.postMessage({
      status: 'success',
      fileName,
      sheetName,
      totalRows: dataRows.length,
      validRows,
      invalidRows: dataRows.length - validRows,
      headers,
      errors,
    });
  } catch (error) {
    self.postMessage({
      status: 'error',
      message: error?.message || 'Could not read this file. Please upload a valid Excel file.',
    });
  }
};
