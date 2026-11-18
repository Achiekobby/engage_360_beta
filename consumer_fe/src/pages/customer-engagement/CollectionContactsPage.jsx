import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Reveal } from '../../components/motion';
import { CUSTOMER_COLLECTIONS } from '../../components/customer-engagement/customers/customersData';
import ContactsPageHeader from '../../components/customer-engagement/customers/ContactsPageHeader';
import ContactsFiltersBar from '../../components/customer-engagement/customers/ContactsFiltersBar';
import ContactsEmptyState from '../../components/customer-engagement/customers/ContactsEmptyState';
import ContactsTableSkeleton from '../../components/customer-engagement/customers/ContactsTableSkeleton';
import CustomersDataTable from '../../components/customer-engagement/customers/CustomersDataTable';
import CustomersPagination from '../../components/customer-engagement/customers/CustomersPagination';
import OnboardCustomerDrawer, {
  contactFromFormValues,
} from '../../components/customer-engagement/customers/OnboardCustomerDrawer';
import ViewCustomerDrawer from '../../components/customer-engagement/customers/ViewCustomerDrawer';
import ActionConfirmModal from '../../components/customer-engagement/customers/ActionConfirmModal';
import SuccessModal, {
  ONBOARD_SUCCESS,
} from '../../components/customer-engagement/customers/SuccessModal';
import { createCollectionContact } from '../../services/customer-engagement/contacts';
import {
  invalidateCollectionContacts,
  useCollectionContacts,
  useCollectionContactsClient,
} from '../../hooks/useCollectionContacts';
import { useAppDispatch } from '../../store/hooks';
import { notifyError, notifySuccess } from '../../utils/toast';

const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_PAGE_SIZE = 25;

function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function CollectionContactsPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const queryClient = useCollectionContactsClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const collection = useMemo(() => {
    const fromState = location.state?.collection;
    if (fromState?.id && String(fromState.id) === String(collectionId)) return fromState;
    return CUSTOMER_COLLECTIONS.find((item) => String(item.id) === String(collectionId)) || {
      id: collectionId,
      name: 'Collection',
      categoryId: location.state?.categoryId || null,
    };
  }, [collectionId, location.state]);

  const uploadId = searchParams.get('uploadId') || '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = PAGE_SIZE_OPTIONS.includes(Number(searchParams.get('pageSize')))
    ? Number(searchParams.get('pageSize'))
    : DEFAULT_PAGE_SIZE;
  const search = searchParams.get('search') || '';
  const gender = searchParams.get('gender') || '';
  const locationFilter = searchParams.get('location') || '';
  const sort = searchParams.get('sort') || 'registeredAt';
  const sortDir = searchParams.get('sortDir') || 'desc';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 350);
  const [filtersOpen, setFiltersOpen] = useState(Boolean(gender || locationFilter));
  const [selectedIds, setSelectedIds] = useState([]);
  const [importedBanner, setImportedBanner] = useState(
    location.state?.importedCount ? Number(location.state.importedCount) : 0,
  );

  const [onboardOpen, setOnboardOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [removedIds, setRemovedIds] = useState([]);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [localOverrides, setLocalOverrides] = useState({});

  const filters = useMemo(
    () => ({
      page,
      pageSize,
      search,
      gender,
      location: locationFilter,
      uploadId,
      sort,
      sortDir,
    }),
    [gender, locationFilter, page, pageSize, search, sort, sortDir, uploadId],
  );

  const {
    contacts: fetchedContacts,
    total,
    totalPages,
    isInitialLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useCollectionContacts(collectionId, filters);

  const customers = useMemo(
    () =>
      fetchedContacts
        .filter((contact) => !removedIds.includes(contact.id))
        .map((contact) =>
          localOverrides[contact.id] ? { ...contact, ...localOverrides[contact.id] } : contact,
        ),
    [fetchedContacts, localOverrides, removedIds],
  );

  const uploadLabel = location.state?.upload?.fileName || null;

  const updateParams = useCallback(
    (patch, { replace = false } = {}) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (value == null || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      setSearchParams(next, { replace });
    },
    [searchParams, setSearchParams],
  );

  const goToImport = () => {
    navigate(`/customer-engagement/customers/${collectionId}`, {
      state: { collection, categoryId: collection?.categoryId, openBulkImport: true },
    });
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch === search) return;
    updateParams({ search: debouncedSearch, page: 1 }, { replace: true });
  }, [debouncedSearch, search, updateParams]);

  useEffect(() => {
    setSelectedIds([]);
  }, [fetchedContacts]);

  useEffect(() => {
    if (!importedBanner) return undefined;
    if (location.state?.importedCount) {
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: {
          ...location.state,
          importedCount: undefined,
        },
      });
    }
    const timer = window.setTimeout(() => setImportedBanner(0), 6000);
    return () => window.clearTimeout(timer);
  }, [importedBanner]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const pageIds = customers.map((item) => item.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])],
    );
  };

  const handleToggleActive = (customer) => {
    setLocalOverrides((prev) => ({
      ...prev,
      [customer.id]: {
        ...(prev[customer.id] || {}),
        isActive: customer.isActive === false,
      },
    }));
  };

  const handleConfirmDeleteContact = async () => {
    if (!contactToDelete?.id) return;
    setRemovedIds((prev) => [...prev, contactToDelete.id]);
    setSelectedIds((prev) => prev.filter((id) => id !== contactToDelete.id));
    setContactToDelete(null);
    if (viewCustomer?.id === contactToDelete.id) setViewCustomer(null);
  };

  const handleSegmentChange = (customer, segment) => {
    setLocalOverrides((prev) => ({
      ...prev,
      [customer.id]: { ...(prev[customer.id] || {}), segment },
    }));
    if (viewCustomer?.id === customer.id) {
      setViewCustomer((prev) => (prev ? { ...prev, segment } : prev));
    }
  };

  const handleSubmitCustomer = async (formData) => {
    const values = formData.values || {};
    const patch = contactFromFormValues(values);

    if (formData.id) {
      setLocalOverrides((prev) => ({
        ...prev,
        [formData.id]: {
          ...(prev[formData.id] || {}),
          ...patch,
        },
      }));
      setEditCustomer(null);
      setOnboardOpen(false);
      return;
    }

    try {
      await createCollectionContact(collectionId, {
        ...values,
        collection_id: collectionId,
        contact_file_id: formData.uploadId || uploadId || null,
      });
      await invalidateCollectionContacts(queryClient, collectionId);
      setOnboardOpen(false);
      setEditCustomer(null);
      setSuccessModal('onboard');
      dispatch(notifySuccess('Customer onboarded successfully.', { title: 'Success' }));
    } catch (submitError) {
      dispatch(
        notifyError(submitError?.message || 'Could not add this customer.', {
          title: 'Add failed',
        }),
      );
      throw submitError;
    }
  };

  const handleConfirmDeleteSelected = async () => {
    setIsDeletingSelected(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setSelectedIds([]);
      setDeleteSelectedOpen(false);
      await invalidateCollectionContacts(queryClient, collectionId);
    } finally {
      setIsDeletingSelected(false);
    }
  };

  const hasActiveFilters = Boolean(search || gender || locationFilter || uploadId);
  const showEmptyNoContacts =
    !isInitialLoading && !isError && total === 0 && !hasActiveFilters;
  const showEmptyNoResults =
    !isInitialLoading && !isError && total === 0 && hasActiveFilters;
  const showTable = !isInitialLoading && !isError && total > 0;

  if (!collectionId) {
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
        <ContactsPageHeader
          collection={collection}
          totalContacts={isInitialLoading ? null : total}
          uploadLabel={uploadLabel}
        />
      </Reveal>

      {importedBanner > 0 ? (
        <div className="mt-4 rounded-sm border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-3 text-sm text-[#047857]">
          <span className="font-semibold">
            {importedBanner.toLocaleString()} contact{importedBanner === 1 ? '' : 's'}
          </span>{' '}
          imported successfully.
        </div>
      ) : null}

      {!showEmptyNoContacts ? (
        <>
          <Reveal variant="fadeUp" amount={0.15} delay={0.06} className="mt-6">
            <ContactsFiltersBar
              searchQuery={searchInput}
              onSearchChange={setSearchInput}
              selectedCount={selectedIds.length}
              onRefresh={() => refetch()}
              onDeleteSelected={() => {
                if (selectedIds.length) setDeleteSelectedOpen(true);
              }}
              onExport={() => {}}
              gender={gender}
              location={locationFilter}
              onGenderChange={(value) => updateParams({ gender: value, page: 1 })}
              onLocationChange={(value) => updateParams({ location: value, page: 1 })}
              onClearFilters={() => {
                setSearchInput('');
                updateParams({
                  search: '',
                  gender: '',
                  location: '',
                  uploadId: '',
                  page: 1,
                });
              }}
              filtersOpen={filtersOpen}
              onToggleFilters={() => setFiltersOpen((prev) => !prev)}
            />
          </Reveal>

          {uploadId ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateParams({ uploadId: '', page: 1 })}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-[#F7F8FF] px-2.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/15"
              >
                Upload: {uploadLabel || uploadId}
                <span aria-hidden="true">×</span>
              </button>
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-[#717171]">
              Rows
              <select
                value={pageSize}
                onChange={(event) =>
                  updateParams({ pageSize: event.target.value, page: 1 })
                }
                className="rounded-sm border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-sm font-semibold text-[#0B1354]"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-[#717171]">
              Sort
              <select
                value={`${sort}:${sortDir}`}
                onChange={(event) => {
                  const [nextSort, nextDir] = event.target.value.split(':');
                  updateParams({ sort: nextSort, sortDir: nextDir, page: 1 });
                }}
                className="rounded-sm border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-sm font-semibold text-[#0B1354]"
              >
                <option value="registeredAt:desc">Date added (newest)</option>
                <option value="registeredAt:asc">Date added (oldest)</option>
                <option value="fullName:asc">Name (A–Z)</option>
                <option value="fullName:desc">Name (Z–A)</option>
                <option value="phone:asc">Phone (A–Z)</option>
                <option value="phone:desc">Phone (Z–A)</option>
              </select>
            </label>
            {isFetching && !isInitialLoading ? (
              <span className="text-xs font-medium text-[#8B92A5]">Updating…</span>
            ) : null}
          </div>
        </>
      ) : null}

      <Reveal variant="fadeUp" amount={0.15} delay={0.1} className="mt-4">
        {isError ? (
          <div className="rounded-sm border border-[#F5D0D0] bg-[#FFF7F7] px-5 py-10 text-center">
            <h2 className="text-lg font-bold text-[#0B1354]">We couldn&apos;t load your contacts.</h2>
            <p className="mt-1 text-sm text-[#B42318]">
              {error?.message || 'Please try again.'}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex cursor-pointer rounded-sm border border-[#F5D0D0] bg-white px-4 py-2 text-sm font-semibold text-[#B42318]"
            >
              Retry
            </button>
          </div>
        ) : isInitialLoading ? (
          <ContactsTableSkeleton />
        ) : showEmptyNoContacts ? (
          <ContactsEmptyState onImport={goToImport} />
        ) : showEmptyNoResults ? (
          <div className="rounded-sm border border-[#EEF0F4] bg-white px-6 py-14 text-center shadow-[0_4px_20px_rgba(11,19,84,0.04)]">
            <h2 className="text-lg font-bold text-[#0B1354]">No contacts found</h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-[#717171]">
              Try adjusting your search or clearing some filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateParams({
                  search: '',
                  gender: '',
                  location: '',
                  uploadId: '',
                  page: 1,
                });
              }}
              className="mt-5 inline-flex cursor-pointer rounded-sm border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1354]"
            >
              Clear Filters
            </button>
          </div>
        ) : showTable ? (
          <CustomersDataTable
            customers={customers}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onView={setViewCustomer}
            onEdit={(customer) => {
              setEditCustomer(customer);
              setOnboardOpen(true);
            }}
            onSegmentChange={handleSegmentChange}
            onDelete={setContactToDelete}
            onToggleActive={handleToggleActive}
            footer={
              <CustomersPagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                pageSize={pageSize}
                onPageChange={(nextPage) => updateParams({ page: nextPage })}
                itemLabel="contacts"
              />
            }
          />
        ) : null}
      </Reveal>

      <OnboardCustomerDrawer
        isOpen={onboardOpen}
        onClose={() => {
          setOnboardOpen(false);
          setEditCustomer(null);
        }}
        onSubmit={handleSubmitCustomer}
        initialData={editCustomer}
        uploadId={uploadId || null}
        contextLabel={uploadLabel || collection?.name || ''}
      />

      <ViewCustomerDrawer
        customer={viewCustomer}
        isOpen={Boolean(viewCustomer)}
        onClose={() => setViewCustomer(null)}
        onEdit={(customer) => {
          setViewCustomer(null);
          setEditCustomer(customer);
          setOnboardOpen(true);
        }}
      />

      <ActionConfirmModal
        isOpen={Boolean(contactToDelete)}
        onClose={() => setContactToDelete(null)}
        onConfirm={handleConfirmDeleteContact}
        icon={Trash2}
        tone="danger"
        title="Delete this contact?"
        description="This contact will be removed from the list."
        entityLabel={contactToDelete?.fullName}
        entityMeta={contactToDelete?.phone}
        warning="This cannot be undone from the current screen."
        confirmLabel="Delete contact"
        cancelLabel="Keep contact"
      />

      <ActionConfirmModal
        isOpen={deleteSelectedOpen}
        onClose={() => {
          if (isDeletingSelected) return;
          setDeleteSelectedOpen(false);
        }}
        onConfirm={handleConfirmDeleteSelected}
        icon={Trash2}
        tone="danger"
        title="Delete selected contacts?"
        description="The selected contacts will be removed from this collection."
        entityLabel={`${selectedIds.length} contact${selectedIds.length === 1 ? '' : 's'}`}
        entityMeta={collection?.name ? `From ${collection.name}` : undefined}
        warning="This cannot be undone from the current screen."
        confirmLabel="Delete contacts"
        cancelLabel="Keep contacts"
        isLoading={isDeletingSelected}
      />

      <SuccessModal
        isOpen={successModal === 'onboard'}
        onClose={() => setSuccessModal(null)}
        {...ONBOARD_SUCCESS}
        onAction={() => {
          setSuccessModal(null);
          setEditCustomer(null);
          setOnboardOpen(true);
        }}
      />

    </main>
  );
}
