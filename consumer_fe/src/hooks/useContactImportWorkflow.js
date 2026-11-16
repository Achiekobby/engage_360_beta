import { useCallback, useMemo, useRef, useState } from 'react';
import {
  CONTACT_UPLOAD_STATUSES,
  IMPORT_STATUSES,
  ISSUE_TYPES,
  isContactUploadInProgress,
  normalizeContactUploadStatus,
} from '../utils/contact-import/constants';
import {
  formatFileSize,
  isAcceptedExcelFile,
  uploadContactsFile,
  waitForContactUpload,
} from '../services/customer-engagement/contactImport';
import { STANDARD_FIELD_KEYS } from '../services/customer-engagement/contactFields';
import { useExcelValidationWorker } from './useExcelValidationWorker';

function progressMessageForUploadStatus(status) {
  const normalized = normalizeContactUploadStatus(status);
  if (normalized === CONTACT_UPLOAD_STATUSES.PROCESSING) return 'Import underway…';
  if (normalized === CONTACT_UPLOAD_STATUSES.PENDING) return 'Waiting for processing…';
  if (normalized === CONTACT_UPLOAD_STATUSES.PARTIAL) return 'Import finished with some failures';
  if (normalized === CONTACT_UPLOAD_STATUSES.COMPLETED) return 'Import complete';
  if (normalized === CONTACT_UPLOAD_STATUSES.FAILED) return 'Import unsuccessful';
  return 'Checking upload status…';
}

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

function buildColumnMapping(configuredKeys = [], fileColumns = []) {
  const available = new Set((fileColumns || []).map(String));
  const mapping = {};
  configuredKeys.forEach((key) => {
    if (!key || !available.has(key)) return;
    mapping[key] = key;
  });
  return mapping;
}

export function useContactImportWorkflow({ collectionId, token, tokenType } = {}) {
  const { callWorker, reset: resetWorker, terminate } = useExcelValidationWorker();
  const [state, setState] = useState(INITIAL_STATE);
  const importingRef = useRef(false);
  const generationRef = useRef(0);
  const fileRef = useRef(null);

  const setSafeState = useCallback((updater) => {
    setState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const reset = useCallback(async () => {
    generationRef.current += 1;
    importingRef.current = false;
    fileRef.current = null;
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
        fileRef.current = null;
        setSafeState({
          ...INITIAL_STATE,
          status: IMPORT_STATUSES.FAILED,
          error: 'Only .xlsx, .xls, or .csv files are supported.',
        });
        return;
      }

      const generation = ++generationRef.current;
      fileRef.current = file;
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

  const importContacts = useCallback(
    async ({ configuredKeys = [] } = {}) => {
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
      if (!fileRef.current) {
        throw new Error('Choose a file to upload.');
      }

      const keys = (configuredKeys.length ? configuredKeys : state.validation?.columns || []).filter(
        Boolean,
      );
      const columnMapping = buildColumnMapping(keys, state.validation?.columns || []);
      const missingRequired = STANDARD_FIELD_KEYS.filter((key) => !columnMapping[key]);
      if (missingRequired.length) {
        throw new Error(
          `The file is missing required column${missingRequired.length === 1 ? '' : 's'}: ${missingRequired.join(', ')}.`,
        );
      }

      importingRef.current = true;
      setSafeState((prev) => ({
        ...prev,
        status: IMPORT_STATUSES.UPLOADING,
        progressMessage: 'Uploading contacts…',
        error: '',
      }));

      const generation = generationRef.current;

      try {
        const apiResult = await uploadContactsFile(
          {
            collectionId,
            file: fileRef.current,
            columnMapping,
          },
          { token, tokenType },
        );

        if (generation !== generationRef.current) return null;

        const uploadId = apiResult?.data?.upload_id || apiResult?.data?.id;
        let finalResult = apiResult;
        const initialStatus = normalizeContactUploadStatus(apiResult?.data?.status);

        if (uploadId && isContactUploadInProgress(initialStatus || CONTACT_UPLOAD_STATUSES.PENDING)) {
          setSafeState((prev) => ({
            ...prev,
            status: IMPORT_STATUSES.PROCESSING,
            progress: 70,
            progressMessage: progressMessageForUploadStatus(
              initialStatus || CONTACT_UPLOAD_STATUSES.PENDING,
            ),
            importResult: apiResult,
          }));

          finalResult = await waitForContactUpload(uploadId, {
            token,
            tokenType,
            intervalMs: 5000,
            shouldContinue: () => generation === generationRef.current,
            onUpdate: (result) => {
              if (generation !== generationRef.current) return;
              setSafeState((prev) => ({
                ...prev,
                status: IMPORT_STATUSES.PROCESSING,
                progress: Math.min(95, Math.max(prev.progress || 70, 75)),
                progressMessage: progressMessageForUploadStatus(result?.data?.status),
                importResult: result,
              }));
            },
          });
        }

        if (generation !== generationRef.current) return null;

        const finalStatus = normalizeContactUploadStatus(finalResult?.data?.status);
        if (finalStatus === CONTACT_UPLOAD_STATUSES.FAILED) {
          const message = finalResult?.message || 'Import unsuccessful.';
          setSafeState((prev) => ({
            ...prev,
            status: IMPORT_STATUSES.FAILED,
            progress: 100,
            progressMessage: progressMessageForUploadStatus(finalStatus),
            importResult: finalResult,
            error: message,
          }));
          throw new Error(message);
        }

        setSafeState((prev) => ({
          ...prev,
          status: IMPORT_STATUSES.COMPLETE,
          progress: 100,
          progressMessage: progressMessageForUploadStatus(
            finalStatus || CONTACT_UPLOAD_STATUSES.COMPLETED,
          ),
          importResult: finalResult,
          error: '',
        }));

        return finalResult;
      } catch (error) {
        if (error?.name === 'UploadPollCancelled' || generation !== generationRef.current) {
          return null;
        }
        setSafeState((prev) => ({
          ...prev,
          status: IMPORT_STATUSES.FAILED,
          error: error?.message || 'Import failed.',
        }));
        throw error;
      } finally {
        importingRef.current = false;
      }
    },
    [
      collectionId,
      setSafeState,
      state.validation?.columns,
      state.validation?.readyToImport,
      token,
      tokenType,
    ],
  );

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
    canImport:
      Boolean(state.validation?.readyToImport) &&
      state.status !== IMPORT_STATUSES.UPLOADING &&
      state.status !== IMPORT_STATUSES.PROCESSING,
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
