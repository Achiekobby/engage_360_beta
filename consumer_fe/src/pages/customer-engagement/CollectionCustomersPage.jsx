import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Reveal } from '../../components/motion';
import { CUSTOMER_COLLECTIONS } from '../../components/customer-engagement/customers/customersData';
import CollectionCustomersHeader from '../../components/customer-engagement/customers/CollectionCustomersHeader';
import CollectionBulkUploadsPanel from '../../components/customer-engagement/customers/CollectionBulkUploadsPanel';
import BulkImportDrawer from '../../components/customer-engagement/customers/bulk-import/BulkImportDrawer';
import OnboardCustomerDrawer from '../../components/customer-engagement/customers/OnboardCustomerDrawer';
import SuccessModal, {
  ONBOARD_SUCCESS,
} from '../../components/customer-engagement/customers/SuccessModal';
import { createCollectionContact } from '../../services/customer-engagement/contacts';
import {
  invalidateCollectionContacts,
  useCollectionContactsClient,
} from '../../hooks/useCollectionContacts';
import { useAppDispatch } from '../../store/hooks';
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
  const queryClient = useCollectionContactsClient();

  const collection = useMemo(() => {
    const fromState = location.state?.collection;
    if (fromState?.id === collectionId) return fromState;
    return CUSTOMER_COLLECTIONS.find((item) => item.id === collectionId);
  }, [collectionId, location.state]);

  const [uploads, setUploads] = useState([]);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [successModal, setSuccessModal] = useState(null);

  const contactsPath = `/customer-engagement/customers/${collectionId}/contacts`;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open import once from contacts empty CTA
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
      },
    });
  };

  const handleOpenBulkUpload = () => setBulkImportOpen(true);

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

    setUploads((prev) => [created, ...prev]);
    if (uploadStatus === 'completed' || uploadStatus === 'partial') {
      await invalidateCollectionContacts(queryClient, collectionId);
    }

    goToContacts(
      { uploadId: created.id },
      { upload: created, importedCount: created.successCount },
    );
  };

  const handleSubmitCustomer = async (formData) => {
    const phoneDigits = String(formData.phone || '').replace(/\D/g, '');

    try {
      await createCollectionContact(collectionId, {
        first_name: String(formData.fullName || '').split(' ')[0] || '',
        last_name: String(formData.fullName || '').split(' ').slice(1).join(' ') || '',
        email: formData.email,
        gender: formData.gender,
        phone_number: phoneDigits,
        location: formData.location,
        region: formData.region,
        segment: formData.segment || 'New Customer',
        category: formData.category,
        sub_category: formData.subCategory,
      });
      await invalidateCollectionContacts(queryClient, collectionId);
      setEditCustomer(null);
      setOnboardOpen(false);
      setSuccessModal('onboard');
      dispatch(notifySuccess('Customer onboarded successfully.', { title: 'Success' }));
    } catch (submitError) {
      dispatch(
        notifyError(submitError?.message || 'Could not add this customer.', {
          title: 'Add failed',
        }),
      );
    }
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
          onAddCustomer={() => {
            setEditCustomer(null);
            setOnboardOpen(true);
          }}
        />
      </Reveal>

      <Reveal variant="fadeUp" amount={0.15} delay={0.06} className="mt-6">
        <CollectionBulkUploadsPanel
          uploads={uploads}
          onSelectUpload={(upload) =>
            goToContacts({ uploadId: upload.id }, { upload })
          }
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

      <OnboardCustomerDrawer
        isOpen={onboardOpen}
        onClose={() => {
          setOnboardOpen(false);
          setEditCustomer(null);
        }}
        onSubmit={handleSubmitCustomer}
        initialData={editCustomer}
      />

      <SuccessModal
        isOpen={successModal === 'onboard'}
        onClose={() => setSuccessModal(null)}
        {...ONBOARD_SUCCESS}
        actionLabel="View Contacts"
        onAction={() => {
          setSuccessModal(null);
          goToContacts();
        }}
      />
    </main>
  );
}
