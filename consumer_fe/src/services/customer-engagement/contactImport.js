import { downloadContactTemplate } from '../../utils/contact-import/excelIO';
import { appendImportedContacts } from './contacts';

export function downloadContactsExcelTemplate() {
  downloadContactTemplate('engage360-contacts-template.xlsx');
}

/**
 * Local import until POST /api/collections/:id/import-contacts is provided.
 * Persists validated contacts into the in-memory collection store.
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
  return name.endsWith('.xlsx') || name.endsWith('.xls');
}
