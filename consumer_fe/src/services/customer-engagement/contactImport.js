import { apiFormRequest, apiRequest } from '../api/request';
import { downloadContactTemplate } from '../../utils/contact-import/excelIO';
import {
  isContactUploadInProgress,
  isContactUploadTerminal,
  normalizeContactUploadStatus,
} from '../../utils/contact-import/constants';
import { appendImportedContacts } from './contacts';

const DEFAULT_UPLOAD_POLL_MS = 5000;

export function downloadContactsExcelTemplate(columns = []) {
  downloadContactTemplate('engage360-contacts-template.xlsx', columns);
}

/**
 * Build multipart body for POST /api/contacts/upload.
 * columnMapping keys are destination field keys; values are source file headers.
 */
export function buildContactsUploadFormData({ collectionId, file, columnMapping = {} }) {
  const body = new FormData();
  body.append('collection_id', String(collectionId || ''));
  body.append('file', file);

  Object.entries(columnMapping).forEach(([fieldKey, sourceHeader]) => {
    if (!fieldKey || sourceHeader == null || sourceHeader === '') return;
    body.append(`column_mapping[${fieldKey}]`, String(sourceHeader));
  });

  return body;
}

export async function uploadContactsFile(
  { collectionId, file, columnMapping },
  { token, tokenType } = {},
) {
  if (!collectionId) throw new Error('Missing collection id.');
  if (!file) throw new Error('Choose a file to upload.');
  if (!token) throw new Error('Sign in to upload contacts.');

  const mappingEntries = Object.entries(columnMapping || {}).filter(
    ([key, value]) => key && value != null && value !== '',
  );
  if (!mappingEntries.length) {
    throw new Error('Map at least one column before uploading.');
  }

  return apiFormRequest('/api/contacts/upload', {
    method: 'POST',
    token,
    tokenType,
    formData: buildContactsUploadFormData({
      collectionId,
      file,
      columnMapping: Object.fromEntries(mappingEntries),
    }),
  });
}

export async function getContactUploadStatus(uploadId, { token, tokenType } = {}) {
  if (!uploadId) throw new Error('Missing upload id.');
  if (!token) throw new Error('Sign in to check upload status.');

  const result = await apiRequest(`/api/contacts/uploads/${encodeURIComponent(uploadId)}`, {
    token,
    tokenType,
  });
  const data = result?.data && typeof result.data === 'object' ? result.data : {};

  return {
    ...result,
    data: {
      ...data,
      upload_id: data.upload_id || data.id || uploadId,
      status: normalizeContactUploadStatus(data.status),
    },
  };
}

/**
 * Poll GET /api/contacts/uploads/{upload_id} while status is pending or processing.
 */
export async function waitForContactUpload(
  uploadId,
  {
    token,
    tokenType,
    intervalMs = DEFAULT_UPLOAD_POLL_MS,
    shouldContinue,
    onUpdate,
  } = {},
) {
  if (!uploadId) throw new Error('Missing upload id.');

  while (true) {
    if (shouldContinue && !shouldContinue()) {
      const cancelError = new Error('Upload status check cancelled.');
      cancelError.name = 'UploadPollCancelled';
      throw cancelError;
    }

    let latest;
    try {
      latest = await getContactUploadStatus(uploadId, { token, tokenType });
    } catch (error) {
      if (error?.status === 429) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, error.retryAfterMs || 30000);
        });
        continue;
      }
      throw error;
    }
    onUpdate?.(latest);

    if (
      isContactUploadTerminal(latest.data?.status) ||
      !isContactUploadInProgress(latest.data?.status)
    ) {
      return latest;
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, Math.max(1500, intervalMs));
    });
  }
}

/**
 * Local import fallback used only when the remote upload path is unavailable in tests.
 * Prefer uploadContactsFile for production uploads.
 */
export async function importCollectionContacts(
  collectionId,
  { fileName, contacts },
) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!collectionId) {
    throw new Error('Missing collection id.');
  }

  const uploadId = `upl-${Date.now()}`;
  const saved = appendImportedContacts(collectionId, contacts || [], { uploadId });

  return {
    success: true,
    data: {
      id: uploadId,
      upload_id: uploadId,
      file_name: fileName || 'contacts-import.xlsx',
      contacts: saved.slice(0, (contacts || []).length),
      total: (contacts || []).length,
    },
  };
}

export function formatFileSize(bytes = 0) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
}

export function isAcceptedExcelFile(file) {
  if (!file) return false;
  const name = String(file.name || '').toLowerCase();
  return name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv');
}
