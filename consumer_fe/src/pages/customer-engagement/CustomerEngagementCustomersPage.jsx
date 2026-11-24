import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Reveal, StaggerItem, StaggerReveal } from '../../components/motion';
import MetricCard from '../../components/customer-engagement/dashboard/MetricCard';
import CustomersPageHeader from '../../components/customer-engagement/customers/CustomersPageHeader';
import CustomersToolbar from '../../components/customer-engagement/customers/CustomersToolbar';
import CategoriesView from '../../components/customer-engagement/customers/CategoriesView';
import CollectionsView from '../../components/customer-engagement/customers/CollectionsView';
import { FolderOpen, Trash2 } from 'lucide-react';
import CreateCustomerCategoryDrawer from '../../components/customer-engagement/customers/CreateCustomerCategoryDrawer';
import AddCollectionDrawer from '../../components/customer-engagement/customers/AddCollectionDrawer';
import ActionConfirmModal from '../../components/customer-engagement/customers/ActionConfirmModal';
import OnboardCustomerDrawer from '../../components/customer-engagement/customers/OnboardCustomerDrawer';
import SuccessModal, {
  CATEGORY_CREATED_SUCCESS,
  COLLECTION_CREATED_SUCCESS,
} from '../../components/customer-engagement/customers/SuccessModal';
import {
  CUSTOMERS_PAGE_METRICS,
  createCollectionEntry,
  individualContactCount,
  mapCategoryFromApi,
  mapCollectionFromApi,
} from '../../components/customer-engagement/customers/customersData';
import {
  createCategory,
  deleteCategory,
  invalidateCategoriesCache,
  updateCategory,
} from '../../services/customer-engagement/categories';
import {
  createCollection,
  deleteCollection,
  updateCollection,
} from '../../services/customer-engagement/collections';
import {
  CUSTOMER_CATEGORIES_QUERY_KEY,
  useCustomerCategories,
  useCustomerCategoriesClient,
} from '../../hooks/useCustomerCategories';
import {
  CATEGORY_COLLECTIONS_QUERY_KEY,
  useCategoryCollections,
} from '../../hooks/useCategoryCollections';
import {
  invalidateContactStatistics,
  useContactStatistics,
} from '../../hooks/useContactStatistics';
import { invalidateCollectionContacts } from '../../hooks/useCollectionContacts';
import {
  COLLECTION_UPLOADS_QUERY_KEY,
  listCollectionUploads,
} from '../../services/customer-engagement/contactImport';
import {
  addContact,
  countContactsAcrossUploads,
} from '../../services/customer-engagement/contacts';
import { invalidateCollectionUploads } from '../../hooks/useCollectionUploads';
import { useAppDispatch } from '../../store/hooks';
import { notifyError, notifySuccess } from '../../utils/toast';

export default function CustomerEngagementCustomersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const queryClient = useCustomerCategoriesClient();
  const {
    categories,
    token,
    tokenType,
    isLoading: categoriesLoading,
    isFetching,
    error,
    refetch,
    isError,
  } = useCustomerCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);
  const [collectionDrawerOpen, setCollectionDrawerOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(location.state?.categoryId ?? null);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [lastCreatedCollection, setLastCreatedCollection] = useState(null);
  const [customerCollection, setCustomerCollection] = useState(null);

  useEffect(() => {
    setActiveCategoryId(location.state?.categoryId ?? null);
  }, [location.state?.categoryId]);

  const categoriesError = !token
    ? 'Sign in to load your customer categories.'
    : isError
      ? error?.message || 'Could not load categories.'
      : '';

  const activeCategory = useMemo(
    () => categories.find((item) => String(item.id) === String(activeCategoryId)) || null,
    [categories, activeCategoryId],
  );

  const {
    collections,
    isLoading: collectionsLoading,
    isFetching: collectionsFetching,
    isError: collectionsIsError,
    error: collectionsError,
    refetch: refetchCollections,
  } = useCategoryCollections(activeCategoryId, activeCategory);

  const collectionsErrorMessage = collectionsIsError
    ? collectionsError?.message || 'Could not load collections.'
    : '';

  const collectionsWithFiles = collections.filter((collection) => Number(collection.fileCount) > 0);
  const uploadedContactCountKey = collectionsWithFiles.map((collection) => String(collection.id)).join(',');

  const uploadedContactCounts = useQuery({
    queryKey: ['upload-contact-counts', String(activeCategoryId || 'none'), uploadedContactCountKey, token || 'guest'],
    enabled: Boolean(token && activeCategory && uploadedContactCountKey),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    queryFn: async () => {
      const counts = {};
      for (const collection of collectionsWithFiles) {
        const uploads = await queryClient.fetchQuery({
          queryKey: [...COLLECTION_UPLOADS_QUERY_KEY, String(collection.id), token || 'guest'],
          staleTime: 1000 * 60 * 5,
          queryFn: () => listCollectionUploads(collection.id, { token, tokenType }),
        });
        counts[String(collection.id)] = await countContactsAcrossUploads(
          (uploads || []).map((upload) => upload.id),
          { token, tokenType },
        );
      }
      return counts;
    },
  });

  const collectionCountById = useMemo(() => {
    const counts = {};

    categories.forEach((category) => {
      counts[category.id] = category.collectionsCount || 0;
    });

    if (activeCategoryId != null && !collectionsLoading) {
      counts[activeCategoryId] = collections.length;
    }

    return counts;
  }, [categories, collections.length, activeCategoryId]);

  const { statistics } = useContactStatistics();

  const refreshStatistics = () => invalidateContactStatistics(queryClient);

  const pageMetrics = useMemo(() => {
    const growth = statistics?.growth;
    const growthRate = growth?.growthRate;
    const growthValue =
      growthRate == null || Number.isNaN(growthRate)
        ? '—'
        : `${Number.isInteger(growthRate) ? growthRate : growthRate.toFixed(1)}%`;
    const count = (value) => (statistics ? Number(value || 0).toLocaleString() : '—');

    return CUSTOMERS_PAGE_METRICS.map((metric) => {
      if (metric.id === 'categories') {
        return {
          ...metric,
          value: count(statistics?.totalCategories),
          change: null,
          hint: 'All categories',
        };
      }
      if (metric.id === 'files') {
        return {
          ...metric,
          value: count(statistics?.totalCollections),
          change: null,
          hint: 'All collections',
        };
      }
      if (metric.id === 'growth') {
        return {
          ...metric,
          value: statistics ? growthValue : '—',
          change: null,
          hint: statistics ? `${growth?.currentMonth || 0} this month` : 'Monthly',
        };
      }
      if (metric.id === 'total') {
        return {
          ...metric,
          value: count(statistics?.totalContacts),
          change: null,
          hint: 'All contacts',
        };
      }
      return { ...metric, change: null };
    });
  }, [statistics]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        (category.description || '').toLowerCase().includes(query),
    );
  }, [categories, searchQuery]);

  const collectionsWithIndividuals = useMemo(
    () =>
      collections.map((collection) => {
        const total = Number(collection.customersCountRaw) || 0;
        if (!Number(collection.fileCount)) {
          return { ...collection, individualCount: total };
        }
        if (uploadedContactCounts.isPending || uploadedContactCounts.isError) {
          return { ...collection, individualCount: null };
        }
        return {
          ...collection,
          individualCount: individualContactCount(
            total,
            uploadedContactCounts.data?.[String(collection.id)],
          ),
        };
      }),
    [collections, uploadedContactCounts.data, uploadedContactCounts.isError, uploadedContactCounts.isPending],
  );

  const filteredCollections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return collectionsWithIndividuals;

    return collectionsWithIndividuals.filter((collection) =>
      collection.name.toLowerCase().includes(query),
    );
  }, [collectionsWithIndividuals, searchQuery]);

  const openCategory = (category) => {
    setSearchQuery('');
    setActiveCategoryId(category.id);
    navigate('/customer-engagement/customers', {
      replace: true,
      state: { categoryId: category.id },
    });
  };

  const closeCategory = () => {
    setSearchQuery('');
    setActiveCategoryId(null);
    navigate('/customer-engagement/customers', { replace: true, state: null });
  };

  const handleOpenCollectionDrawer = (category) => {
    if (!category) return;
    setEditingCollection(null);
    setPendingCategory(category);
    setCollectionDrawerOpen(true);
  };

  const handleOpenEditCollection = (collection) => {
    if (!collection) return;
    const category =
      categories.find((item) => String(item.id) === String(collection.categoryId)) ||
      activeCategory;
    setEditingCollection(collection);
    setPendingCategory(category);
    setCollectionDrawerOpen(true);
  };

  const setCachedCategories = (updater) => {
    queryClient.setQueryData([...CUSTOMER_CATEGORIES_QUERY_KEY, token || 'guest'], (prev = []) =>
      typeof updater === 'function' ? updater(prev) : updater,
    );
  };

  const handleAddCollectionCustomer = async (formData) => {
    if (!customerCollection?.id) return;
    const values = formData.values || {};
    try {
      const result = await addContact(
        { ...values, collection_id: customerCollection.id },
        { token, tokenType },
      );
      setCachedCollections((prev) =>
        prev.map((item) => {
          if (String(item.id) !== String(customerCollection.id)) return item;
          const contacts = (Number(item.customersCountRaw) || 0) + 1;
          return { ...item, customersCountRaw: contacts, customerCount: String(contacts) };
        }),
      );
      setCachedCategories((prev) =>
        prev.map((item) =>
          String(item.id) === String(customerCollection.categoryId)
            ? { ...item, contactsCount: (Number(item.contactsCount) || 0) + 1 }
            : item,
        ),
      );
      await invalidateCollectionContacts(queryClient, customerCollection.id);
      await refreshStatistics();
      setCustomerCollection(null);
      dispatch(
        notifySuccess(result?.message || 'Contact added successfully.', {
          title: 'Contact added',
        }),
      );
    } catch (submitError) {
      dispatch(
        notifyError(submitError?.message || 'Could not add this customer.', {
          title: 'Add failed',
        }),
      );
      throw submitError;
    }
  };

  const setCachedCollections = (updater) => {
    if (activeCategoryId == null) return;
    queryClient.setQueryData(
      [...CATEGORY_COLLECTIONS_QUERY_KEY, String(activeCategoryId), token || 'guest'],
      (prev = []) => (typeof updater === 'function' ? updater(prev) : updater),
    );
  };

  const handleSaveCategory = async ({ name, description }) => {
    const trimmedName = String(name || '').trim();
    if (!trimmedName) return;

    const editingId = editingCategory?.id;
    const isEdit = Boolean(editingId);

    const exists = categories.some(
      (item) =>
        item.name.toLowerCase() === trimmedName.toLowerCase() &&
        String(item.id) !== String(editingId || ''),
    );
    if (exists) {
      const saveError = new Error('A category with this name already exists.');
      dispatch(
        notifyError(saveError.message, {
          title: isEdit ? 'Category not updated' : 'Category not created',
        }),
      );
      throw saveError;
    }

    if (!token) {
      const saveError = new Error('Sign in to manage customer categories.');
      dispatch(
        notifyError(saveError.message, {
          title: isEdit ? 'Category not updated' : 'Category not created',
        }),
      );
      throw saveError;
    }

    try {
      if (isEdit) {
        const result = await updateCategory(
          editingId,
          { name: trimmedName, description },
          { token, tokenType },
        );
        const payload =
          result?.data && typeof result.data === 'object' && !Array.isArray(result.data)
            ? result.data
            : {
                ...editingCategory,
                name: trimmedName,
                description,
              };
        const styleIndex = Math.max(
          0,
          categories.findIndex((item) => String(item.id) === String(editingId)),
        );
        const updated = {
          ...editingCategory,
          ...mapCategoryFromApi(payload, styleIndex),
          id: editingId,
          name: payload.name || trimmedName,
          description: payload.description || description || '',
          collectionsCount:
            Number(
              payload.collections_count ??
                payload.collectionsCount ??
                editingCategory.collectionsCount,
            ) || 0,
          contactsCount:
            Number(
              payload.contacts_count ?? payload.contactsCount ?? editingCategory.contactsCount,
            ) || 0,
        };

        setCachedCategories((prev) =>
          prev.map((item) => (String(item.id) === String(editingId) ? { ...item, ...updated } : item)),
        );
        if (String(activeCategoryId) === String(editingId)) {
          setActiveCategoryId(editingId);
        }
        if (pendingCategory && String(pendingCategory.id) === String(editingId)) {
          setPendingCategory(updated);
        }
        await refreshStatistics();
        dispatch(
          notifySuccess(result?.message || 'Customer category updated successfully.', {
            title: 'Category updated',
          }),
        );
        setEditingCategory(null);
        return;
      }

      const result = await createCategory(
        { name: trimmedName, description },
        { token, tokenType },
      );
      const payload =
        result?.data && typeof result.data === 'object' && !Array.isArray(result.data)
          ? result.data
          : {
              name: trimmedName,
              description,
              collections_count: 0,
              created_at: new Date().toISOString(),
            };
      const created = mapCategoryFromApi(payload, categories.length);
      const category = {
        ...created,
        name: created.name || trimmedName,
        description: created.description || description || '',
        collectionsCount: created.collectionsCount || 0,
      };

      setCachedCategories((prev) => [...prev, category]);
      setSearchQuery('');
      setActiveCategoryId(category.id);
      setPendingCategory(category);
      navigate('/customer-engagement/customers', {
        replace: true,
        state: { categoryId: category.id },
      });
      await refreshStatistics();
      dispatch(
        notifySuccess(result?.message || 'Customer category created successfully.', {
          title: 'Category created',
        }),
      );
      setSuccessModal('category');
    } catch (saveError) {
      dispatch(
        notifyError(saveError?.message || 'Could not save the category.', {
          title: isEdit ? 'Category not updated' : 'Category not created',
        }),
      );
      throw saveError;
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete?.id) return;

    if (!token) {
      dispatch(
        notifyError('Sign in to delete a customer category.', {
          title: 'Category not deleted',
        }),
      );
      return;
    }

    setIsDeletingCategory(true);
    try {
      const deletedId = categoryToDelete.id;
      const result = await deleteCategory(deletedId, { token, tokenType });
      setCachedCategories((prev) =>
        prev.filter((item) => String(item.id) !== String(deletedId)),
      );
      queryClient.removeQueries({
        queryKey: [...CATEGORY_COLLECTIONS_QUERY_KEY, String(deletedId)],
      });
      if (String(activeCategoryId) === String(deletedId)) {
        closeCategory();
      }
      if (pendingCategory && String(pendingCategory.id) === String(deletedId)) {
        setPendingCategory(null);
      }
      if (editingCategory && String(editingCategory.id) === String(deletedId)) {
        setEditingCategory(null);
        setCategoryDrawerOpen(false);
      }
      await refreshStatistics();
      dispatch(
        notifySuccess(result?.message || 'Category and associated records archived successfully.', {
          title: 'Category archived',
        }),
      );
      setCategoryToDelete(null);
    } catch (deleteError) {
      dispatch(
        notifyError(deleteError?.message || 'Could not delete the category.', {
          title: 'Category not deleted',
        }),
      );
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleSaveCollection = async (name, collectionBeingEdited = null) => {
    const editing = collectionBeingEdited || editingCollection;
    const isEdit = Boolean(editing?.id);
    const category = pendingCategory || activeCategory;
    const trimmedName = String(name || '').trim();
    if (!trimmedName) return;
    if (!isEdit && !category?.id) return;

    const exists = collections.some(
      (item) =>
        item.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!isEdit || String(item.id) !== String(editing.id)),
    );
    if (exists) {
      const saveError = new Error('A collection with this name already exists in this category.');
      dispatch(
        notifyError(saveError.message, {
          title: isEdit ? 'Collection not updated' : 'Collection not created',
        }),
      );
      throw saveError;
    }

    if (!token) {
      const saveError = new Error(
        isEdit ? 'Sign in to update a collection.' : 'Sign in to create a collection.',
      );
      dispatch(
        notifyError(saveError.message, {
          title: isEdit ? 'Collection not updated' : 'Collection not created',
        }),
      );
      throw saveError;
    }

    try {
      if (isEdit) {
        const categoryId = editing.categoryId ?? category?.id;
        const result = await updateCollection(
          editing.id,
          { name: trimmedName, categoryId },
          { token, tokenType },
        );
        const payload =
          result?.data && typeof result.data === 'object' && !Array.isArray(result.data)
            ? result.data
            : {
                ...editing,
                name: trimmedName,
                category_id: categoryId,
              };
        const styleIndex = Math.max(
          0,
          collections.findIndex((item) => String(item.id) === String(editing.id)),
        );
        const fallbackCategory =
          categories.find((item) => String(item.id) === String(categoryId)) ||
          category ||
          activeCategory;
        const updated = {
          ...editing,
          ...mapCollectionFromApi(payload, styleIndex, fallbackCategory),
          id: editing.id,
          name: payload.name || trimmedName,
          categoryId: payload.category_id ?? payload.categoryId ?? categoryId,
          category:
            payload.category_name ||
            payload.categoryName ||
            payload.category ||
            fallbackCategory?.name ||
            editing.category,
          ...(payload.files_count == null && payload.fileCount == null
            ? { fileCount: editing.fileCount }
            : {}),
          ...(payload.contacts_count == null && payload.customers_count == null
            ? {
                customerCount: editing.customerCount,
                customersCountRaw: editing.customersCountRaw,
              }
            : {}),
        };

        setCachedCollections((prev) =>
          prev.map((item) => (String(item.id) === String(editing.id) ? { ...item, ...updated } : item)),
        );
        setEditingCollection(null);
        setPendingCategory(null);
        await refreshStatistics();
        dispatch(
          notifySuccess(result?.message || 'Collection updated successfully.', {
            title: 'Collection updated',
          }),
        );
        return;
      }

      const result = await createCollection(
        { categoryId: category.id, name: trimmedName },
        { token, tokenType },
      );
      const payload =
        result?.data && typeof result.data === 'object' && !Array.isArray(result.data)
          ? result.data
          : {
              name: trimmedName,
              category_id: category.id,
              files_count: 0,
              customers_count: 0,
              created_at: new Date().toISOString(),
            };

      const mapped = mapCollectionFromApi(payload, collections.length, category);
      const newCollection = {
        ...mapped,
        name: mapped.name || trimmedName,
        categoryId: mapped.categoryId ?? category.id,
        category: mapped.category || category.name,
      };

      const collection =
        newCollection.id != null
          ? newCollection
          : createCollectionEntry({
              name: trimmedName,
              category: category.name,
              categoryId: category.id,
              styleIndex: collections.length,
            });

      setCachedCollections((prev) => [collection, ...prev]);
      setCachedCategories((prev) =>
        prev.map((item) =>
          String(item.id) === String(category.id)
            ? { ...item, collectionsCount: (item.collectionsCount || 0) + 1 }
            : item,
        ),
      );
      setLastCreatedCollection(collection);
      setPendingCategory(null);
      await refreshStatistics();
      dispatch(
        notifySuccess(result?.message || 'Collection created successfully.', {
          title: 'Collection created',
        }),
      );
      setSuccessModal('collection');
    } catch (saveError) {
      dispatch(
        notifyError(
          saveError?.message ||
            (isEdit ? 'Could not update the collection.' : 'Could not create the collection.'),
          {
            title: isEdit ? 'Collection not updated' : 'Collection not created',
          },
        ),
      );
      throw saveError;
    }
  };

  const handleConfirmDeleteCollection = async () => {
    if (!collectionToDelete?.id) return;

    if (!token) {
      dispatch(
        notifyError('Sign in to archive a collection.', {
          title: 'Collection not archived',
        }),
      );
      return;
    }

    setIsDeletingCollection(true);
    try {
      const deletedId = collectionToDelete.id;
      const removedContacts = Number(collectionToDelete.customersCountRaw) || 0;
      const result = await deleteCollection(deletedId, { token, tokenType });
      setCachedCollections((prev) =>
        prev.filter((item) => String(item.id) !== String(deletedId)),
      );
      setCachedCategories((prev) =>
        prev.map((item) =>
          String(item.id) === String(collectionToDelete.categoryId)
            ? {
                ...item,
                collectionsCount: Math.max(0, (item.collectionsCount || 0) - 1),
                contactsCount: Math.max(0, (item.contactsCount || 0) - removedContacts),
              }
            : item,
        ),
      );
      await invalidateCollectionUploads(queryClient, deletedId);
      await invalidateCollectionContacts(queryClient, deletedId);
      await refreshStatistics();
      dispatch(
        notifySuccess(result?.message || 'Collection archived successfully.', {
          title: 'Collection archived',
        }),
      );
      setCollectionToDelete(null);
    } catch (deleteError) {
      dispatch(
        notifyError(deleteError?.message || 'Could not archive the collection.', {
          title: 'Collection not archived',
        }),
      );
    } finally {
      setIsDeletingCollection(false);
    }
  };

  const handleView = (collection) => {
    navigate(`/customer-engagement/customers/${collection.id}`, {
      state: { collection, categoryId: collection.categoryId },
    });
  };

  const handleViewContacts = (collection) => {
    navigate(`/customer-engagement/customers/${collection.id}/contacts`, {
      state: { collection, categoryId: collection.categoryId },
    });
  };

  const handleRetryCategories = async () => {
    invalidateCategoriesCache({ clearRateLimit: true });
    await refetch({ cancelRefetch: false });
  };

  const categoryForDrawer = pendingCategory || activeCategory;
  const showCategoriesLoading = Boolean(token) && categoriesLoading && categories.length === 0;
  const showCollectionsLoading =
    Boolean(activeCategory) && collectionsLoading && collections.length === 0;

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <CustomersPageHeader
          category={activeCategory}
          collectionCount={activeCategory ? collections.length : 0}
          categoryCount={categories.length}
          onAddCategory={() => {
            setEditingCategory(null);
            setCategoryDrawerOpen(true);
          }}
          onAddCollection={() => handleOpenCollectionDrawer(activeCategory)}
          onBack={closeCategory}
        />
      </Reveal>

      <StaggerReveal
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        stagger={0.06}
      >
        {pageMetrics.map((metric) => (
          <StaggerItem key={metric.id}>
            <MetricCard {...metric} />
          </StaggerItem>
        ))}
      </StaggerReveal>

      <Reveal variant="fadeUp" amount={0.15} delay={0.08} className="mt-6">
        <CustomersToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={activeCategory ? filteredCollections.length : filteredCategories.length}
          placeholder={activeCategory ? 'Search collections...' : 'Search categories...'}
          resultNoun={activeCategory ? 'collection' : 'category'}
          showCategoryFilter={false}
        />
      </Reveal>

      {!activeCategory && categoriesError ? (
        <div className="mt-4 flex flex-col items-start gap-3 rounded-sm border border-[#F5D0D0] bg-[#FFF7F7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#B42318]">{categoriesError}</p>
          <button
            type="button"
            onClick={handleRetryCategories}
            disabled={isFetching}
            className="cursor-pointer rounded-sm border border-[#F5D0D0] bg-white px-3 py-2 text-sm font-semibold text-[#B42318] transition-colors hover:bg-[#FFF1F1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetching ? 'Retrying...' : 'Try again'}
          </button>
        </div>
      ) : null}

      {activeCategory && collectionsErrorMessage ? (
        <div className="mt-4 flex flex-col items-start gap-3 rounded-sm border border-[#F5D0D0] bg-[#FFF7F7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#B42318]">{collectionsErrorMessage}</p>
          <button
            type="button"
            onClick={() => refetchCollections()}
            disabled={collectionsFetching}
            className="cursor-pointer rounded-sm border border-[#F5D0D0] bg-white px-3 py-2 text-sm font-semibold text-[#B42318] transition-colors hover:bg-[#FFF1F1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {collectionsFetching ? 'Retrying...' : 'Try again'}
          </button>
        </div>
      ) : null}

      <Reveal variant="fadeUp" amount={0.15} delay={0.12} className="mt-4">
        {activeCategory ? (
          showCollectionsLoading ? (
            <div className="rounded-sm border border-[#EEF0F4] bg-white px-6 py-16 text-center shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
              <p className="text-sm font-semibold text-[#0B1354]">Loading collections...</p>
              <p className="mt-1 text-sm text-[#717171]">
                Fetching collections in {activeCategory.name}.
              </p>
            </div>
          ) : (
            <CollectionsView
              collections={filteredCollections}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onDelete={setCollectionToDelete}
              onEdit={handleOpenEditCollection}
              onView={handleView}
              onViewContacts={handleViewContacts}
              onAddCustomer={setCustomerCollection}
              onAddCollection={() => handleOpenCollectionDrawer(activeCategory)}
              emptyTitle={searchQuery ? 'No collections found' : 'No collections in this category'}
              emptyDescription={
                searchQuery
                  ? 'Try a different collection name in this category.'
                  : 'Add a collection here. Contacts are uploaded and stored inside it.'
              }
              emptyActionLabel={searchQuery ? undefined : 'Add Collection'}
              onEmptyAction={
                searchQuery ? undefined : () => handleOpenCollectionDrawer(activeCategory)
              }
            />
          )
        ) : showCategoriesLoading ? (
          <div className="rounded-sm border border-[#EEF0F4] bg-white px-6 py-16 text-center shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
            <p className="text-sm font-semibold text-[#0B1354]">Loading categories...</p>
            <p className="mt-1 text-sm text-[#717171]">Fetching your customer categories.</p>
          </div>
        ) : (
          <CategoriesView
            categories={filteredCategories}
            collectionCountById={collectionCountById}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpen={openCategory}
            onEdit={(category) => {
              setEditingCategory(category);
              setCategoryDrawerOpen(true);
            }}
            onDelete={setCategoryToDelete}
            onAddCategory={() => {
              setEditingCategory(null);
              setCategoryDrawerOpen(true);
            }}
            searchActive={Boolean(searchQuery.trim())}
          />
        )}
      </Reveal>

      <OnboardCustomerDrawer
        isOpen={Boolean(customerCollection)}
        onClose={() => setCustomerCollection(null)}
        onSubmit={handleAddCollectionCustomer}
        contextLabel={customerCollection?.name || ''}
      />

      <CreateCustomerCategoryDrawer
        isOpen={categoryDrawerOpen}
        initialCategory={editingCategory}
        onClose={() => {
          setCategoryDrawerOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSaveCategory}
      />

      <ActionConfirmModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => {
          if (isDeletingCategory) return;
          setCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDeleteCategory}
        icon={Trash2}
        tone="danger"
        title="Archive this category?"
        description="The category and the collections and contacts stored in it will be archived."
        entityLabel={categoryToDelete?.name}
        entityMeta={
          categoryToDelete
            ? `${categoryToDelete.collectionsCount || 0} collection${
                (categoryToDelete.collectionsCount || 0) === 1 ? '' : 's'
              } · ${categoryToDelete.contactsCount || 0} contact${
                (categoryToDelete.contactsCount || 0) === 1 ? '' : 's'
              }`
            : undefined
        }
        warning="Archived records are removed from this list."
        confirmLabel="Archive category"
        cancelLabel="Keep category"
        isLoading={isDeletingCategory}
      />

      <ActionConfirmModal
        isOpen={Boolean(collectionToDelete)}
        onClose={() => {
          if (isDeletingCollection) return;
          setCollectionToDelete(null);
        }}
        onConfirm={handleConfirmDeleteCollection}
        icon={FolderOpen}
        tone="danger"
        title="Archive this collection?"
        description="The collection and the contacts stored in it will be archived."
        entityLabel={collectionToDelete?.name}
        entityMeta={
          collectionToDelete
            ? `${collectionToDelete.customerCount || '0'} customers · ${
                collectionToDelete.category || 'Category'
              }`
            : undefined
        }
        warning="Archived records are removed from this list."
        confirmLabel="Archive collection"
        cancelLabel="Keep collection"
        isLoading={isDeletingCollection}
      />

      <AddCollectionDrawer
        isOpen={collectionDrawerOpen}
        categoryName={
          editingCollection?.category || categoryForDrawer?.name || activeCategory?.name
        }
        initialCollection={editingCollection}
        onClose={() => {
          setCollectionDrawerOpen(false);
          setPendingCategory(null);
          setEditingCollection(null);
        }}
        onSubmit={handleSaveCollection}
      />

      <SuccessModal
        isOpen={successModal === 'category'}
        onClose={() => setSuccessModal(null)}
        {...CATEGORY_CREATED_SUCCESS}
        onAction={() => {
          setSuccessModal(null);
          handleOpenCollectionDrawer(activeCategory || pendingCategory);
        }}
      />

      <SuccessModal
        isOpen={successModal === 'collection'}
        onClose={() => setSuccessModal(null)}
        {...COLLECTION_CREATED_SUCCESS}
        onAction={() => {
          setSuccessModal(null);
          if (!lastCreatedCollection) return;

          navigate(`/customer-engagement/customers/${lastCreatedCollection.id}`, {
            state: {
              collection: lastCreatedCollection,
              categoryId: lastCreatedCollection.categoryId,
              openOnboard: true,
            },
          });
        }}
      />
    </main>
  );
}
