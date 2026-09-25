import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Reveal } from '../../components/motion';
import { CUSTOMER_COLLECTIONS } from '../../components/customer-engagement/customers/customersData';
import { MOCK_COLLECTION_CUSTOMERS } from '../../components/customer-engagement/customers/collectionCustomersData';
import CollectionCustomersHeader from '../../components/customer-engagement/customers/CollectionCustomersHeader';
import CollectionCustomersToolbar from '../../components/customer-engagement/customers/CollectionCustomersToolbar';
import CustomersDataTable from '../../components/customer-engagement/customers/CustomersDataTable';
import OnboardCustomerDrawer from '../../components/customer-engagement/customers/OnboardCustomerDrawer';
import ViewCustomerDrawer from '../../components/customer-engagement/customers/ViewCustomerDrawer';
import WriteNoteModal from '../../components/customer-engagement/customers/WriteNoteModal';
import SuccessModal, {
  NOTE_PUBLISHED_SUCCESS,
  ONBOARD_SUCCESS,
} from '../../components/customer-engagement/customers/SuccessModal';

function formatRegisteredAt() {
  const now = new Date();
  return now.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(',', ', ');
}

export default function CollectionCustomersPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const collection = useMemo(() => {
    const fromState = location.state?.collection;
    if (fromState?.id === collectionId) return fromState;

    return CUSTOMER_COLLECTIONS.find((item) => item.id === collectionId);
  }, [collectionId, location.state]);

  const [customers, setCustomers] = useState(MOCK_COLLECTION_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const [onboardOpen, setOnboardOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [noteCustomer, setNoteCustomer] = useState(null);
  const [successModal, setSuccessModal] = useState(null);

  useEffect(() => {
    if (location.state?.openOnboard) {
      setEditCustomer(null);
      setOnboardOpen(true);
      navigate(location.pathname, { replace: true, state: { collection: location.state.collection } });
    }
  }, [location.pathname, location.state, navigate]);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.segment.toLowerCase().includes(query),
    );
  }, [customers, searchQuery]);

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

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === filteredCustomers.length
        ? []
        : filteredCustomers.map((customer) => customer.id),
    );
  };

  const handleSegmentChange = (customer, segment) => {
    setCustomers((prev) =>
      prev.map((item) => (item.id === customer.id ? { ...item, segment } : item)),
    );
    if (viewCustomer?.id === customer.id) {
      setViewCustomer((prev) => (prev ? { ...prev, segment } : prev));
    }
  };

  const handleSubmitCustomer = (formData) => {
    const phoneDigits = String(formData.phone || '').replace(/\D/g, '');
    const whatsappDigits = String(formData.whatsapp || '').replace(/\D/g, '');

    if (formData.id) {
      setCustomers((prev) =>
        prev.map((item) =>
          item.id === formData.id
            ? {
                ...item,
                fullName: formData.fullName,
                email: formData.email,
                gender: formData.gender,
                phone: phoneDigits,
                whatsapp: whatsappDigits,
                region: formData.region,
                location: formData.location,
                segment: formData.segment,
                category: formData.category,
                subCategory: formData.subCategory,
              }
            : item,
        ),
      );
      setEditCustomer(null);
      return;
    }

    const newCustomer = {
      id: `c${Date.now()}`,
      fullName: formData.fullName,
      gender: formData.gender,
      age: '18 - 30',
      phone: phoneDigits,
      email: formData.email,
      region: formData.region,
      location: formData.location,
      category: formData.category,
      subCategory: formData.subCategory,
      segment: formData.segment || 'New Customer',
      registeredAt: formatRegisteredAt(),
      customerSince: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      whatsapp: whatsappDigits,
      imageUrl: null,
      notes: [],
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setSuccessModal('onboard');
  };

  const handlePublishNote = (customer, body) => {
    const note = {
      id: `n${Date.now()}`,
      title: `Note ${ (customer.notes?.length || 0) + 1 }`,
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      body,
    };

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === customer.id ? { ...item, notes: [note, ...(item.notes || [])] } : item,
      ),
    );

    if (viewCustomer?.id === customer.id) {
      setViewCustomer((prev) =>
        prev ? { ...prev, notes: [note, ...(prev.notes || [])] } : prev,
      );
    }

    setSuccessModal('note');
  };

  const handleDeleteSelected = () => {
    setCustomers((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <CollectionCustomersHeader
          collection={collection}
          onAddCustomer={() => {
            setEditCustomer(null);
            setOnboardOpen(true);
          }}
        />
      </Reveal>

      <Reveal variant="fadeUp" amount={0.15} delay={0.06} className="mt-6">
        <CollectionCustomersToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCount={selectedIds.length}
          onRefresh={() => setCustomers([...MOCK_COLLECTION_CUSTOMERS])}
          onDeleteSelected={handleDeleteSelected}
          onFilter={() => {}}
          onExport={() => {}}
        />
      </Reveal>

      <Reveal variant="fadeUp" amount={0.15} delay={0.1} className="mt-4">
        <CustomersDataTable
          customers={filteredCustomers}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onView={setViewCustomer}
          onEdit={(customer) => {
            setEditCustomer(customer);
            setOnboardOpen(true);
          }}
          onWriteNote={setNoteCustomer}
          onSegmentChange={handleSegmentChange}
        />
      </Reveal>

      <OnboardCustomerDrawer
        isOpen={onboardOpen}
        onClose={() => {
          setOnboardOpen(false);
          setEditCustomer(null);
        }}
        onSubmit={handleSubmitCustomer}
        initialData={editCustomer}
      />

      <ViewCustomerDrawer
        customer={viewCustomer}
        isOpen={Boolean(viewCustomer)}
        onClose={() => setViewCustomer(null)}
        onWriteNote={(customer) => {
          setNoteCustomer(customer);
        }}
        onEdit={(customer) => {
          setViewCustomer(null);
          setEditCustomer(customer);
          setOnboardOpen(true);
        }}
      />

      <WriteNoteModal
        isOpen={Boolean(noteCustomer)}
        onClose={() => setNoteCustomer(null)}
        customer={noteCustomer}
        onPublish={handlePublishNote}
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

      <SuccessModal
        isOpen={successModal === 'note'}
        onClose={() => setSuccessModal(null)}
        {...NOTE_PUBLISHED_SUCCESS}
        onAction={() => setSuccessModal(null)}
      />
    </main>
  );
}
