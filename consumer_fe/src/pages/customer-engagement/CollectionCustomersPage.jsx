import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Reveal } from '../../components/motion';
import { CUSTOMER_COLLECTIONS } from '../../components/customer-engagement/customers/customersData';
import CollectionCustomersHeader from '../../components/customer-engagement/customers/CollectionCustomersHeader';
import CollectionBulkUploadsPanel from '../../components/customer-engagement/customers/CollectionBulkUploadsPanel';
import ActionConfirmModal from '../../components/customer-engagement/customers/ActionConfirmModal';
import BulkImportDrawer from '../../components/customer-engagement/customers/bulk-import/BulkImportDrawer';
import {
  COLLECTION_UPLOADS_QUERY_KEY,
  deleteContactUpload,
} from '../../services/customer-engagement/contactImport';
import {
  invalidateCollectionContacts,
  useCollectionContactsClient,
} from '../../hooks/useCollectionContacts';
import {
  invalidateCollectionUploads,
  useCollectionUploads,
} from '../../hooks/useCollectionUploads';
import { CATEGORY_COLLECTIONS_QUERY_KEY } from '../../hooks/useCategoryCollections';
import { invalidateContactStatistics } from '../../hooks/useContactStatistics';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { notifyError, notifySuccess } from '../../utils/toast';

function formatRegisteredAt() {
  const now = new Date();
  return now
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(',', ', ');
}

export default function CollectionCustomersPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.user?.token);
  const tokenType = useAppSelector((state) => state.auth.user?.tokenType) || 'Bearer';
  const queryClient = useCollectionContactsClient();

  const collection = useMemo(() => {
    const fromState = location.state?.collection;
    if (fromState?.id === collectionId) return fromState;
    return CUSTOMER_COLLECTIONS.find((item) => item.id === collectionId);
  }, [collectionId, location.state]);

  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [uploadToDelete, setUploadToDelete] = useState(null);
  const [isDeletingUpload, setIsDeletingUpload] = useState(false);

  const contactsPath = `/customer-engagement/customers/${collectionId}/contacts`;
  const {
    uploads,
    isLoading: uploadsLoading,
    isError: uploadsIsError,
    error: uploadsError,
    refetch: refetchUploads,
  } = useCollectionUploads(collectionId);

  useEffect(() => {
    if (!location.state?.openBulkImport) return;
    setBulkImportOpen(true);
    navigate(location.pathname, {
      replace: true,
      state: {
        ...location.state,
        openBulkImport: undefined,
      },
    });
  }, [location.state?.openBulkImport]);

  const goToContacts = (params = {}, state = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') query.set(key, String(value));
    });
    const suffix = query.toString() ? `?${query.toString()}` : '';
    navigate(`${contactsPath}${suffix}`, {
      state: {
        collection,
        categoryId: collection?.categoryId,
        ...state,
        fromUploads: true,
      },
    });
  };

  const handleOpenBulkUpload = () => setBulkImportOpen(true);

  const handleConfirmDeleteUpload = async () => {
    if (!uploadToDelete?.id) return;
    if (!token) {
      dispatch(notifyError('Sign in to delete an upload.', { title: 'Upload not deleted' }));
      return;
    }

    setIsDeletingUpload(true);
    try {
      const result = await deleteContactUpload(uploadToDelete.id, { token, tokenType });
      queryClient.setQueryData(
        [...COLLECTION_UPLOADS_QUERY_KEY, String(collectionId), token || 'guest'],
        (current) =>
          Array.isArray(current)
            ? current.filter((item) => String(item.id) !== String(uploadToDelete.id))
            : current,
      );
      if (collection?.categoryId) {
        const removedContacts = Number(uploadToDelete.successCount) || 0;
        queryClient.setQueryData(
          [...CATEGORY_COLLECTIONS_QUERY_KEY, String(collection.categoryId), token || 'guest'],
          (current) => {
            if (!Array.isArray(current)) return current;
            return current.map((item) => {
              if (String(item.id) !== String(collectionId)) return item;
              const contacts = Math.max(0, (Number(item.customersCountRaw) || 0) - removedContacts);
              return {
                ...item,
                fileCount: Math.max(0, (Number(item.fileCount) || 0) - 1),
                customersCountRaw: contacts,
                customerCount: String(contacts),
              };
            });
          },
        );
      }
      await invalidateCollectionContacts(queryClient, collectionId);
      await invalidateContactStatistics(queryClient);
      dispatch(
        notifySuccess(result?.message || 'Upload and associated customers deleted successfully.', {
          title: 'Upload deleted',
        }),
      );
      setUploadToDelete(null);
    } catch (deleteError) {
      dispatch(
        notifyError(deleteError?.message || 'Could not delete the upload.', {
          title: 'Upload not deleted',
        }),
      );
    } finally {
      setIsDeletingUpload(false);
    }
  };

  const handleBulkImported = async (result, validation) => {
    const uploadedAt = formatRegisteredAt();
    const uploadStatus = String(result?.data?.status || 'completed').toLowerCase();
    const importedCount =
      result?.data?.success_count ??
      result?.data?.imported_count ??
      result?.data?.total ??
      validation?.validRows ??
      0;
    const failedCount =
      result?.data?.failed_count ??
      result?.data?.failure_count ??
      (uploadStatus === 'partial' || uploadStatus === 'failed' ? Math.max(0, (validation?.invalidRows || 0)) : 0);
    const created = {
      id: result?.data?.id || result?.data?.upload_id || `upl-${Date.now()}`,
      fileName: result?.data?.file_name || 'contacts-import.xlsx',
      uploadedAt,
      uploadedBy: 'You',
      rowCount: result?.data?.total_rows ?? result?.data?.total ?? importedCount + failedCount,
      successCount: uploadStatus === 'failed' ? 0 : importedCount,
      failedCount: uploadStatus === 'failed' ? Math.max(failedCount, importedCount || 0) : failedCount,
      status: uploadStatus,
      fileSizeLabel: '—',
    };

    await invalidateCollectionUploads(queryClient, collectionId);
    if (uploadStatus === 'completed' || uploadStatus === 'partial') {
      await invalidateCollectionContacts(queryClient, collectionId);
    }

    goToContacts(
      { uploadId: created.id },
      { upload: created, importedCount: created.successCount },
    );
  };

  if (!collection) {
    return (
      <main className="mx-auto w-full max-w-8xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1354]">Collection not found</h1>
        <button
          type="button"
          onClick={() => navigate('/customer-engagement/customers')}
          className="mt-4 cursor-pointer text-sm font-semibold text-primary"
        >
          Back to collections
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <CollectionCustomersHeader
          collection={collection}
          onBulkUpload={handleOpenBulkUpload}
        />
      </Reveal>

      <Reveal variant="fadeUp" amount={0.15} delay={0.06} className="mt-6">
        <CollectionBulkUploadsPanel
          uploads={uploads}
          isLoading={uploadsLoading}
          error={uploadsIsError ? uploadsError?.message || 'Could not load uploads.' : ''}
          onRetry={() => refetchUploads()}
          onSelectUpload={(upload) =>
            goToContacts({ uploadId: upload.id }, { upload })
          }
          onDeleteUpload={setUploadToDelete}
          onViewAll={uploads.length ? () => goToContacts() : undefined}
          onBulkUpload={handleOpenBulkUpload}
        />
      </Reveal>

      <BulkImportDrawer
        isOpen={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        collection={collection}
        onImported={handleBulkImported}
      />

      <ActionConfirmModal
        isOpen={Boolean(uploadToDelete)}
        onClose={() => {
          if (isDeletingUpload) return;
          setUploadToDelete(null);
        }}
        onConfirm={handleConfirmDeleteUpload}
        icon={Trash2}
        tone="danger"
        title="Delete this upload?"
        description="The upload and the customers imported from it will be deleted."
        entityLabel={uploadToDelete?.fileName}
        entityMeta={
          uploadToDelete
            ? `${uploadToDelete.successCount || 0} imported · ${uploadToDelete.failedCount || 0} failed`
            : undefined
        }
        warning="This cannot be undone."
        confirmLabel="Delete upload"
        cancelLabel="Keep upload"
        isLoading={isDeletingUpload}
      />
    </main>
  );
}
