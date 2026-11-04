import { useCallback, useMemo, useRef, useState } from 'react';
import { IMPORT_STATUSES, ISSUE_TYPES } from '../utils/contact-import/constants';
import {
  formatFileSize,
  importCollectionContacts,
  isAcceptedExcelFile,
} from '../services/customer-engagement/contactImport';
import { useExcelValidationWorker } from './useExcelValidationWorker';

const INITIAL_STATE = {
  status: IMPORT_STATUSES.IDLE,
  fileMeta: null,
  progress: 0,
  progressMessage: '',
  validation: null,
  issues: [],
  fixSummary: null,
  error: '',
  importResult: null,
};

export function useContactImportWorkflow({ collectionId, token, tokenType } = {}) {
  const { callWorker, reset: resetWorker, terminate } = useExcelValidationWorker();
  const [state, setState] = useState(INITIAL_STATE);
  const importingRef = useRef(false);
  const generationRef = useRef(0);

  const setSafeState = useCallback((updater) => {
    setState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const reset = useCallback(async () => {
    generationRef.current += 1;
    importingRef.current = false;
    terminate();
    await resetWorker().catch(() => undefined);
    setSafeState({ ...INITIAL_STATE });
  }, [resetWorker, setSafeState, terminate]);

  const applyValidationResult = useCallback(
    (data, { statusOverride } = {}) => {
      const validation = data.validation;
      const ready = Boolean(validation?.readyToImport);
      setSafeState((prev) => ({
        ...prev,
        status:
          statusOverride ||
          (ready ? IMPORT_STATUSES.READY_TO_UPLOAD : IMPORT_STATUSES.NEEDS_ATTENTION),
        progress: 100,
        progressMessage: ready ? 'Ready to import' : 'Needs attention',
        validation,
        issues: data.issues || [],
        fixSummary: data.fixSummary || prev.fixSummary,
        error: '',
      }));
    },
    [setSafeState],
  );

  const validateFile = useCallback(
    async (file) => {
      if (!file) return;
      if (!isAcceptedExcelFile(file)) {
        setSafeState({
          ...INITIAL_STATE,
          status: IMPORT_STATUSES.FAILED,
          error: 'Only .xlsx or .xls Excel files are supported.',
        });
        return;
      }

      const generation = ++generationRef.current;
      setSafeState({
        ...INITIAL_STATE,
        status: IMPORT_STATUSES.PARSING,
        progress: 5,
        progressMessage: 'Preparing file…',
        fileMeta: {
          name: file.name,
          size: file.size,
          sizeLabel: formatFileSize(file.size),
        },
      });

      try {
        const arrayBuffer = await file.arrayBuffer();
        if (generation !== generationRef.current) return;

        setSafeState((prev) => ({
          ...prev,
          status: IMPORT_STATUSES.VALIDATING,
          progress: 15,
          progressMessage: 'Parsing spreadsheet…',
        }));

        const result = await callWorker(
          'VALIDATE_FILE',
          { arrayBuffer, fileName: file.name },
          {
            onProgress: (progress) => {
              if (generation !== generationRef.current) return;
              setSafeState((prev) => ({
                ...prev,
                status:
                  progress.stage === 'parsing'
                    ? IMPORT_STATUSES.PARSING
                    : IMPORT_STATUSES.VALIDATING,
                progress: progress.progress ?? prev.progress,
                progressMessage: progress.message || prev.progressMessage,
              }));
            },
          },
        );

        if (generation !== generationRef.current) return;
        applyValidationResult(result);
      } catch (error) {
        if (generation !== generationRef.current) return;
        setSafeState((prev) => ({
          ...prev,
          status: IMPORT_STATUSES.FAILED,
          error: error?.message || 'Could not validate the Excel file.',
          progress: 0,
          progressMessage: '',
        }));
      }
    },
    [applyValidationResult, callWorker, setSafeState],
  );

  const autoFix = useCallback(async () => {
    const generation = generationRef.current;
    setSafeState((prev) => ({
      ...prev,
      status: IMPORT_STATUSES.FIXING,
      progress: 20,
      progressMessage: 'Applying safe fixes…',
      error: '',
    }));

    try {
      const result = await callWorker('AUTO_FIX', {}, {
        onProgress: (progress) => {
          if (generation !== generationRef.current) return;
          setSafeState((prev) => ({
            ...prev,
            progress: progress.progress ?? prev.progress,
            progressMessage: progress.message || prev.progressMessage,
          }));
        },
      });
      if (generation !== generationRef.current) return;
      applyValidationResult(result);
    } catch (error) {
      if (generation !== generationRef.current) return;
      setSafeState((prev) => ({
        ...prev,
        status: IMPORT_STATUSES.FAILED,
        error: error?.message || 'Automatic fix failed.',
      }));
    }
  }, [applyValidationResult, callWorker, setSafeState]);

  const updateIssueRow = useCallback(
    async (rowNumber, patch, rowUid) => {
      const result = await callWorker('UPDATE_ROW', { rowNumber, rowUid, patch });
      applyValidationResult(result);
    },
    [applyValidationResult, callWorker],
  );

  const removeIssueRows = useCallback(
    async (targets = []) => {
      const list = Array.isArray(targets) ? targets : [targets];
      const rowNumbers = [];
      const rowUids = [];

      list.forEach((target) => {
        if (target == null) return;
        if (typeof target === 'object') {
          if (target.rowUid != null) rowUids.push(target.rowUid);
          if (target.rowNumber != null) rowNumbers.push(target.rowNumber);
          return;
        }
        rowNumbers.push(target);
      });

      const result = await callWorker('REMOVE_ROWS', { rowNumbers, rowUids });
      applyValidationResult(result);
    },
    [applyValidationResult, callWorker],
  );

  const downloadCleanedExcel = useCallback(async () => {
    const result = await callWorker('EXPORT_CLEANED');
    const blob = new Blob([result.arrayBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = result.fileName || 'contacts-cleaned.xlsx';
    anchor.click();
    URL.revokeObjectURL(url);
  }, [callWorker]);

  const importContacts = useCallback(async () => {
    if (!collectionId) {
      throw new Error('Missing collection id.');
    }
    if (!token) {
      throw new Error('Sign in to import contacts.');
    }
    if (importingRef.current) return null;
    if (!state.validation?.readyToImport) {
      throw new Error('Fix validation issues before importing.');
    }

    importingRef.current = true;
    setSafeState((prev) => ({
      ...prev,
      status: IMPORT_STATUSES.UPLOADING,
      progressMessage: 'Uploading contacts…',
      error: '',
    }));

    try {
      const payloadResult = await callWorker('GET_IMPORT_PAYLOAD');
      const apiResult = await importCollectionContacts(
        collectionId,
        {
          fileName: payloadResult.payload.file_name,
          columns: payloadResult.payload.columns,
          customColumns: payloadResult.payload.custom_columns,
          contacts: payloadResult.payload.contacts,
        },
        { token, tokenType },
      );

      setSafeState((prev) => ({
        ...prev,
        status: IMPORT_STATUSES.COMPLETE,
        progress: 100,
        progressMessage: 'Import complete',
        importResult: apiResult,
      }));

      return apiResult;
    } catch (error) {
      setSafeState((prev) => ({
        ...prev,
        status: IMPORT_STATUSES.FAILED,
        error: error?.message || 'Import failed.',
      }));
      throw error;
    } finally {
      importingRef.current = false;
    }
  }, [
    callWorker,
    collectionId,
    setSafeState,
    state.validation?.readyToImport,
    token,
    tokenType,
  ]);

  const issueCounts = useMemo(() => {
    const counts = {
      all: state.issues.length,
      missing_phone_number: 0,
      invalid_phone: 0,
      empty_row: 0,
      other: 0,
    };

    state.issues.forEach((issue) => {
      if (issue.type === ISSUE_TYPES.MISSING_PHONE_NUMBER) counts.missing_phone_number += 1;
      else if (
        issue.type === ISSUE_TYPES.INVALID_PHONE_PREFIX ||
        issue.type === ISSUE_TYPES.INVALID_PHONE_LENGTH ||
        issue.type === ISSUE_TYPES.INVALID_PHONE_CHARS
      ) {
        counts.invalid_phone += 1;
      } else if (issue.type === ISSUE_TYPES.EMPTY_ROW) counts.empty_row += 1;
      else counts.other += 1;
    });

    return counts;
  }, [state.issues]);

  return {
    ...state,
    issueCounts,
    canImport: Boolean(state.validation?.readyToImport) && state.status !== IMPORT_STATUSES.UPLOADING,
    canAutoFix: (state.validation?.autoFixableCount || 0) > 0,
    validateFile,
    autoFix,
    updateIssueRow,
    removeIssueRows,
    downloadCleanedExcel,
    importContacts,
    reset,
    terminate,
  };
}
