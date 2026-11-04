import { parseWorkbookArrayBuffer, workbookFromRows, workbookToArrayBuffer } from '../utils/contact-import/excelIO';
import {
  autoFixWorkbook,
  removeRowsFromWorkbook,
  toImportContacts,
  toSessionRow,
  updateRowInWorkbook,
  validateWorkbook,
} from '../utils/contact-import/workbookValidation';

let session = createEmptySession();

function createEmptySession() {
  return {
    fileName: '',
    columns: [],
    rows: [],
    duplicateColumns: [],
    validation: null,
  };
}

function post(type, payload = {}) {
  self.postMessage({ type, ...payload });
}

function publicValidation(validation) {
  if (!validation) return null;
  const { rows, ...rest } = validation;
  return {
    ...rest,
    // Keep lightweight issue list only; rows stay in worker session.
    issueCount: rest.issues?.length || 0,
  };
}

function setSessionFromValidation(fileName, validation, duplicateColumns = []) {
  session = {
    fileName,
    columns: validation.columns,
    // Keep stable __uid so edit/remove still match after revalidation.
    rows: (validation.rows || []).map((row) => toSessionRow(row)),
    duplicateColumns,
    validation,
  };
}

self.onmessage = async (event) => {
  const { type, requestId, payload = {} } = event.data || {};

  try {
    if (type === 'RESET') {
      session = createEmptySession();
      post('RESET_DONE', { requestId });
      return;
    }

    if (type === 'VALIDATE_FILE') {
      post('PROGRESS', {
        requestId,
        stage: 'parsing',
        progress: 10,
        message: 'Reading Excel file…',
      });

      const { arrayBuffer, fileName } = payload;
      const parsed = parseWorkbookArrayBuffer(arrayBuffer);

      post('PROGRESS', {
        requestId,
        stage: 'validating',
        progress: 55,
        message: 'Validating contacts…',
      });

      const validation = validateWorkbook({
        columns: parsed.columns,
        rows: parsed.rows,
        duplicateColumns: parsed.duplicates,
      });

      setSessionFromValidation(fileName || 'contacts.xlsx', validation, parsed.duplicates);

      post('PROGRESS', {
        requestId,
        stage: 'complete',
        progress: 100,
        message: 'Validation complete',
      });

      post('VALIDATION_RESULT', {
        requestId,
        fileName: session.fileName,
        validation: publicValidation(validation),
        issues: validation.issues,
      });
      return;
    }

    if (type === 'AUTO_FIX') {
      post('PROGRESS', {
        requestId,
        stage: 'fixing',
        progress: 30,
        message: 'Applying safe automatic fixes…',
      });

      const fixed = autoFixWorkbook({
        columns: session.columns,
        rows: session.rows,
      });

      setSessionFromValidation(session.fileName, fixed.validation, session.duplicateColumns);

      post('PROGRESS', {
        requestId,
        stage: 'complete',
        progress: 100,
        message: 'Automatic fixes applied',
      });

      post('VALIDATION_RESULT', {
        requestId,
        fileName: session.fileName,
        validation: publicValidation(fixed.validation),
        issues: fixed.validation.issues,
        fixSummary: fixed.fixSummary,
      });
      return;
    }

    if (type === 'UPDATE_ROW') {
      const { rowNumber, rowUid, patch } = payload;
      const validation = updateRowInWorkbook({
        columns: session.columns,
        rows: session.rows,
        rowNumber,
        rowUid,
        patch,
      });
      setSessionFromValidation(session.fileName, validation, session.duplicateColumns);
      post('VALIDATION_RESULT', {
        requestId,
        fileName: session.fileName,
        validation: publicValidation(validation),
        issues: validation.issues,
      });
      return;
    }

    if (type === 'REMOVE_ROWS') {
      const { rowNumbers = [], rowUids = [] } = payload;
      const validation = removeRowsFromWorkbook({
        columns: session.columns,
        rows: session.rows,
        rowNumbers,
        rowUids,
      });
      setSessionFromValidation(session.fileName, validation, session.duplicateColumns);
      post('VALIDATION_RESULT', {
        requestId,
        fileName: session.fileName,
        validation: publicValidation(validation),
        issues: validation.issues,
      });
      return;
    }

    if (type === 'EXPORT_CLEANED') {
      const workbook = workbookFromRows(
        session.columns,
        session.validation?.rows || session.rows,
      );
      const arrayBuffer = workbookToArrayBuffer(workbook);
      post('EXPORT_CLEANED_RESULT', {
        requestId,
        fileName: session.fileName.replace(/(\.xlsx|\.xls)?$/i, '') + '-cleaned.xlsx',
        arrayBuffer,
      });
      return;
    }

    if (type === 'GET_IMPORT_PAYLOAD') {
      const contacts = toImportContacts(
        session.validation?.rows || session.rows,
        session.columns,
      );
      post('IMPORT_PAYLOAD_RESULT', {
        requestId,
        payload: {
          file_name: session.fileName,
          columns: session.columns,
          custom_columns: session.validation?.customColumns || [],
          contacts,
          total: contacts.length,
        },
      });
      return;
    }

    throw new Error(`Unknown worker message: ${type}`);
  } catch (error) {
    post('ERROR', {
      requestId,
      message: error?.message || 'Excel validation failed.',
    });
  }
};
