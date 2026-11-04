/**
 * Local contacts store until collection contact APIs are provided.
 * Starts empty — no seeded/placeholder contacts.
 */

const CONTACTS_BY_COLLECTION = new Map();

function getStore(collectionId) {
  const key = String(collectionId || '');
  if (!key) return [];
  if (!CONTACTS_BY_COLLECTION.has(key)) {
    CONTACTS_BY_COLLECTION.set(key, []);
  }
  return CONTACTS_BY_COLLECTION.get(key);
}

export function mapContactFromApi(item = {}, collectionId) {
  const firstName = item.first_name || item.firstName || '';
  const lastName = item.last_name || item.lastName || '';
  const fullName =
    item.full_name ||
    item.fullName ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    'Unknown';

  return {
    id: item.id || `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fullName,
    firstName,
    lastName,
    gender: item.gender || '',
    age: item.age || item.age_range || '',
    phone: item.phone_number || item.phone || '',
    email: item.email || '',
    region: item.region || '',
    location: item.location || '',
    category: item.category || item.category_name || '',
    subCategory: item.sub_category || item.subCategory || '',
    segment: item.segment || item.customer_segment || 'New Customer',
    registeredAt:
      item.registeredAt ||
      item.registered_at ||
      item.created_at ||
      new Date().toLocaleString('en-GB'),
    customerSince: item.customer_since || item.customerSince || '',
    whatsapp: item.whatsapp || item.phone_number || item.phone || '',
    imageUrl: item.image_url || item.imageUrl || null,
    notes: Array.isArray(item.notes) ? item.notes : [],
    custom_fields: item.custom_fields || item.customFields || {},
    collectionId: String(item.collection_id || item.collectionId || collectionId || ''),
    uploadId: item.upload_id || item.uploadId || null,
  };
}

export function getCollectionContactsStore(collectionId) {
  return [...getStore(collectionId)];
}

export function setCollectionContactsStore(collectionId, contacts) {
  CONTACTS_BY_COLLECTION.set(String(collectionId), contacts || []);
  return getCollectionContactsStore(collectionId);
}

export function appendImportedContacts(collectionId, contacts, { uploadId } = {}) {
  const current = getStore(collectionId);
  const mapped = (contacts || []).map((contact, index) =>
    mapContactFromApi(
      {
        ...contact,
        id: contact.id || `imported-${Date.now()}-${index}`,
        uploadId: uploadId || contact.uploadId || contact.upload_id || null,
      },
      collectionId,
    ),
  );
  const next = [...mapped, ...current];
  CONTACTS_BY_COLLECTION.set(String(collectionId), next);
  return next;
}

function matchesSearch(contact, query) {
  if (!query) return true;
  const haystack = [
    contact.fullName,
    contact.firstName,
    contact.lastName,
    contact.phone,
    contact.email,
    contact.location,
    contact.region,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

/**
 * Local paginated query. Swap for GET /api/collections/:id/contacts when ready.
 */
export async function listCollectionContacts(
  collectionId,
  {
    page = 1,
    pageSize = 25,
    search = '',
    gender = '',
    location = '',
    uploadId = '',
    sort = 'registeredAt',
    sortDir = 'desc',
  } = {},
) {
  await new Promise((resolve) => setTimeout(resolve, 120));

  if (!collectionId) {
    return { data: [], meta: { total: 0, page: 1, pageSize, totalPages: 1 } };
  }

  let rows = getCollectionContactsStore(collectionId);
  const query = String(search || '').trim().toLowerCase();

  if (uploadId) {
    rows = rows.filter((item) => String(item.uploadId) === String(uploadId));
  }
  if (gender) {
    rows = rows.filter((item) => String(item.gender).toLowerCase() === String(gender).toLowerCase());
  }
  if (location) {
    rows = rows.filter(
      (item) => String(item.location).toLowerCase() === String(location).toLowerCase(),
    );
  }
  if (query) {
    rows = rows.filter((item) => matchesSearch(item, query));
  }

  const direction = sortDir === 'asc' ? 1 : -1;
  rows = [...rows].sort((a, b) => {
    const left = String(a?.[sort] ?? '').toLowerCase();
    const right = String(b?.[sort] ?? '').toLowerCase();
    if (left < right) return -1 * direction;
    if (left > right) return 1 * direction;
    return 0;
  });

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    data: rows.slice(start, start + pageSize),
    meta: {
      total,
      page: safePage,
      pageSize,
      totalPages,
    },
  };
}

export async function queryCollectionContacts(collectionId, filters = {}) {
  return listCollectionContacts(collectionId, filters);
}

/**
 * Local singular create until POST /api/collections/:id/contacts is provided.
 */
export async function createCollectionContact(collectionId, payload = {}) {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const [created] = appendImportedContacts(collectionId, [payload]);
  return { success: true, data: created };
}

export const COLLECTION_CONTACTS_QUERY_KEY = ['collection-contacts'];
