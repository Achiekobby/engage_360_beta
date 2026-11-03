import { useEffect, useMemo, useState } from 'react';
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
import SuccessModal, {
  CATEGORY_CREATED_SUCCESS,
  COLLECTION_CREATED_SUCCESS,
} from '../../components/customer-engagement/customers/SuccessModal';
import {
  CUSTOMERS_PAGE_METRICS,
  CUSTOMER_COLLECTIONS,
  createCollectionEntry,
  mapCategoryFromApi,
} from '../../components/customer-engagement/customers/customersData';
import {
  createCategory,
  deleteCategory,
  invalidateCategoriesCache,
  updateCategory,
} from '../../services/customer-engagement/categories';
import {
  CUSTOMER_CATEGORIES_QUERY_KEY,
  useCustomerCategories,
  useCustomerCategoriesClient,
} from '../../hooks/useCustomerCategories';
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
  const [viewMode, setViewMode] = useState('cards');
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);
  const [collectionDrawerOpen, setCollectionDrawerOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [collections, setCollections] = useState(CUSTOMER_COLLECTIONS);
  const [activeCategoryId, setActiveCategoryId] = useState(location.state?.categoryId ?? null);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [lastCreatedCollection, setLastCreatedCollection] = useState(null);

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

  const collectionCountById = useMemo(() => {
    const counts = {};

    categories.forEach((category) => {
      counts[category.id] = category.collectionsCount || 0;
    });

    collections.forEach((collection) => {
      const key = collection.categoryId;
      if (key == null || counts[key] != null) return;
      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  }, [categories, collections]);

  const pageMetrics = useMemo(() => {
    const totalFiles = collections.reduce((sum, item) => sum + (item.fileCount || 0), 0);

    return CUSTOMERS_PAGE_METRICS.map((metric) => {
      if (metric.id === 'categories') {
        return { ...metric, value: String(categories.length) };
      }
      if (metric.id === 'files') {
        return { ...metric, value: String(totalFiles) };
      }
      return metric;
    });
  }, [categories.length, collections]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) => {
      if (category.name.toLowerCase().includes(query)) return true;
      return collections.some(
        (collection) =>
          String(collection.categoryId) === String(category.id) &&
          collection.name.toLowerCase().includes(query),
      );
    });
  }, [categories, collections, searchQuery]);

  const categoryCollections = useMemo(() => {
    if (!activeCategory) return [];
    return collections.filter(
      (collection) => String(collection.categoryId) === String(activeCategory.id),
    );
  }, [activeCategory, collections]);

  const filteredCollections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categoryCollections;

    return categoryCollections.filter((collection) => collection.name.toLowerCase().includes(query));
  }, [categoryCollections, searchQuery]);

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
    setPendingCategory(category);
    setCollectionDrawerOpen(true);
  };

  const setCachedCategories = (updater) => {
    queryClient.setQueryData([...CUSTOMER_CATEGORIES_QUERY_KEY, token || 'guest'], (prev = []) =>
      typeof updater === 'function' ? updater(prev) : updater,
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
      const result = await deleteCategory(categoryToDelete.id, { token, tokenType });
      setCachedCategories((prev) =>
        prev.filter((item) => String(item.id) !== String(categoryToDelete.id)),
      );
      if (String(activeCategoryId) === String(categoryToDelete.id)) {
        closeCategory();
      }
      dispatch(
        notifySuccess(result?.message || 'Customer category deleted successfully.', {
          title: 'Category deleted',
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

  const handleCreateCollection = (name) => {
    const category = pendingCategory || activeCategory;
    if (!category) return;

    const newCollection = createCollectionEntry({
      name,
      category: category.name,
      categoryId: category.id,
      styleIndex: collections.length,
    });

    setCollections((prev) => [newCollection, ...prev]);
    setCachedCategories((prev) =>
      prev.map((item) =>
        String(item.id) === String(category.id)
          ? { ...item, collectionsCount: (item.collectionsCount || 0) + 1 }
          : item,
      ),
    );
    setLastCreatedCollection(newCollection);
    setPendingCategory(null);
    setSuccessModal('collection');
  };

  const handleConfirmDeleteCollection = async () => {
    if (!collectionToDelete?.id) return;

    setIsDeletingCollection(true);
    try {
      // Local removal until the collections delete endpoint is wired.
      await new Promise((resolve) => setTimeout(resolve, 250));
      setCollections((prev) =>
        prev.filter((item) => String(item.id) !== String(collectionToDelete.id)),
      );
      setCachedCategories((prev) =>
        prev.map((item) =>
          String(item.id) === String(collectionToDelete.categoryId)
            ? {
                ...item,
                collectionsCount: Math.max(0, (item.collectionsCount || 0) - 1),
              }
            : item,
        ),
      );
      dispatch(
        notifySuccess('Collection deleted successfully.', {
          title: 'Collection deleted',
        }),
      );
      setCollectionToDelete(null);
    } catch (deleteError) {
      dispatch(
        notifyError(deleteError?.message || 'Could not delete the collection.', {
          title: 'Collection not deleted',
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

  const handleRetryCategories = async () => {
    invalidateCategoriesCache({ clearRateLimit: true });
    await refetch({ cancelRefetch: false });
  };

  const categoryForDrawer = pendingCategory || activeCategory;
  const showCategoriesLoading = Boolean(token) && categoriesLoading && categories.length === 0;

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <CustomersPageHeader
          category={activeCategory}
          collectionCount={
            activeCategory
              ? activeCategory.collectionsCount ?? categoryCollections.length
              : 0
          }
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

      <Reveal variant="fadeUp" amount={0.15} delay={0.12} className="mt-4">
        {activeCategory ? (
          <CollectionsView
            collections={filteredCollections}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onDelete={setCollectionToDelete}
            onView={handleView}
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
        title="Delete this category?"
        description="This removes the category from your workspace. This action cannot be undone."
        entityLabel={categoryToDelete?.name}
        entityMeta={
          categoryToDelete
            ? `${categoryToDelete.collectionsCount || 0} collection${
                (categoryToDelete.collectionsCount || 0) === 1 ? '' : 's'
              } linked`
            : undefined
        }
        warning="Collections under this category may become unavailable after deletion."
        confirmLabel="Delete category"
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
        title="Delete this collection?"
        description="Contacts stored in this collection will no longer be reachable from here."
        entityLabel={collectionToDelete?.name}
        entityMeta={
          collectionToDelete
            ? `${collectionToDelete.customerCount || '0'} customers · ${
                collectionToDelete.category || 'Category'
              }`
            : undefined
        }
        warning="Delete only if you are sure this list is no longer needed."
        confirmLabel="Delete collection"
        cancelLabel="Keep collection"
        isLoading={isDeletingCollection}
      />

      <AddCollectionDrawer
        isOpen={collectionDrawerOpen}
        categoryName={categoryForDrawer?.name}
        onClose={() => {
          setCollectionDrawerOpen(false);
          setPendingCategory(null);
        }}
        onSubmit={handleCreateCollection}
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
