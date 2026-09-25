import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal, StaggerItem, StaggerReveal } from '../../components/motion';
import MetricCard from '../../components/customer-engagement/dashboard/MetricCard';
import CustomersPageHeader from '../../components/customer-engagement/customers/CustomersPageHeader';
import CustomersToolbar from '../../components/customer-engagement/customers/CustomersToolbar';
import CollectionsView from '../../components/customer-engagement/customers/CollectionsView';
import CreateCustomerCategoryDrawer from '../../components/customer-engagement/customers/CreateCustomerCategoryDrawer';
import AddCollectionDrawer from '../../components/customer-engagement/customers/AddCollectionDrawer';
import SuccessModal, {
  CATEGORY_CREATED_SUCCESS,
  COLLECTION_CREATED_SUCCESS,
} from '../../components/customer-engagement/customers/SuccessModal';
import {
  CUSTOMERS_PAGE_METRICS,
  CUSTOMER_COLLECTIONS,
  createCollectionEntry,
} from '../../components/customer-engagement/customers/customersData';

function getInitialCategories() {
  return [...new Set(CUSTOMER_COLLECTIONS.map(({ category }) => category))];
}

export default function CustomerEngagementCustomersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [collectionDrawerOpen, setCollectionDrawerOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [categories, setCategories] = useState(getInitialCategories);
  const [collections, setCollections] = useState(CUSTOMER_COLLECTIONS);
  const [lastCreatedCategory, setLastCreatedCategory] = useState(null);
  const [pendingCollectionCategory, setPendingCollectionCategory] = useState(null);
  const [lastCreatedCollection, setLastCreatedCollection] = useState(null);

  const categoryFilterOptions = useMemo(
    () => ['All Categories', ...categories],
    [categories],
  );

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

  const filteredCollections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return collections;

    return collections.filter(
      ({ name, category }) =>
        name.toLowerCase().includes(query) || category.toLowerCase().includes(query),
    );
  }, [collections, searchQuery]);

  const handleAddCategory = () => {
    setCategoryDrawerOpen(true);
  };

  const handleOpenCollectionDrawer = (category = null) => {
    setPendingCollectionCategory(category);
    setCollectionDrawerOpen(true);
  };

  const handleCreateCategory = (name) => {
    const exists = categories.some((item) => item.toLowerCase() === name.toLowerCase());
    if (exists) return;

    setCategories((prev) => [...prev, name]);
    setLastCreatedCategory(name);
    setSuccessModal('category');
  };

  const handleCreateCollection = (name) => {
    const category =
      pendingCollectionCategory || lastCreatedCategory || categories[0] || 'General';
    const newCollection = createCollectionEntry({
      name,
      category,
      styleIndex: collections.length,
    });

    setCollections((prev) => [newCollection, ...prev]);
    setLastCreatedCollection(newCollection);
    setPendingCollectionCategory(null);
    setSuccessModal('collection');
  };

  const handleDelete = () => {
    // Placeholder for delete flow
  };

  const handleView = (collection) => {
    navigate(`/customer-engagement/customers/${collection.id}`, { state: { collection } });
  };

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <CustomersPageHeader
          onAddCategory={handleAddCategory}
          collectionCount={collections.length}
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
          resultCount={filteredCollections.length}
          categoryOptions={categoryFilterOptions}
        />
      </Reveal>

      <Reveal variant="fadeUp" amount={0.15} delay={0.12} className="mt-4">
        <CollectionsView
          collections={filteredCollections}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onDelete={handleDelete}
          onView={handleView}
          onAddCollection={() => handleOpenCollectionDrawer()}
        />
      </Reveal>

      <CreateCustomerCategoryDrawer
        isOpen={categoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <AddCollectionDrawer
        isOpen={collectionDrawerOpen}
        onClose={() => {
          setCollectionDrawerOpen(false);
          setPendingCollectionCategory(null);
        }}
        onSubmit={handleCreateCollection}
      />

      <SuccessModal
        isOpen={successModal === 'category'}
        onClose={() => setSuccessModal(null)}
        {...CATEGORY_CREATED_SUCCESS}
        onAction={() => {
          setSuccessModal(null);
          handleOpenCollectionDrawer(lastCreatedCategory);
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
            state: { collection: lastCreatedCollection, openOnboard: true },
          });
        }}
      />
    </main>
  );
}
