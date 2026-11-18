import { apiRequest } from '../api/request';

/**
 * Contacts for one upload: GET /api/contacts/uploads/{upload_id}/contacts.
 * Contacts for a collection: GET /api/collections/{collection_id}/contacts.
 * The local store only keeps contacts created in this session before a refresh.
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

function readAttributes(attributes) {
  if (Array.isArray(attributes)) {
    return attributes.reduce((fields, item) => {
      if (!item || typeof item !== 'object') return fields;
      const key = item.key || item.name || item.field;
      if (!key) return fields;
      fields[key] = item.value ?? '';
      return fields;
    }, {});
  }
  if (attributes && typeof attributes === 'object') return { ...attributes };
  return {};
}

function formatContactDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function mapContactFromApi(item = {}, collectionId) {
  const attributes = readAttributes(item.attributes);
  const customFields = {
    ...attributes,
    ...(item.custom_fields || item.customFields || {}),
  };
  const firstName = String(item.first_name || item.firstName || customFields.first_name || '').trim();
  const lastName = String(item.last_name || item.lastName || customFields.last_name || '').trim();
  const fullName =
    item.full_name ||
    item.fullName ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    'Unknown';
  const phone = item.phone_number || item.phone || customFields.phone_number || '';

  return {
    id: item.id || `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fullName,
    firstName,
    lastName,
    gender: item.gender || customFields.gender || '',
    age: item.age || item.age_range || customFields.age_range || customFields.age || '',
    phone,
    email: item.email || customFields.email || '',
    region: item.region || customFields.region || '',
    location: item.location || customFields.residential_location || customFields.location || '',
    category: item.category || item.category_name || '',
    subCategory: item.sub_category || item.subCategory || '',
    segment: item.segment || item.customer_segment || customFields.customer_type || 'New Customer',
    registeredAt:
      formatContactDate(item.registeredAt || item.registered_at || item.created_at || '') ||
      new Date().toLocaleString('en-GB'),
    customerSince: item.customer_since || item.customerSince || '',
    whatsapp: item.whatsapp || phone,
    imageUrl: item.image_url || item.imageUrl || null,
    notes: Array.isArray(item.notes) ? item.notes : [],
    custom_fields: customFields,
    isActive: item.is_active !== false,
    collectionId: String(item.collection_id || item.collectionId || collectionId || ''),
    uploadId: item.contact_file_id || item.upload_id || item.uploadId || null,
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

function contactsMeta(pagination = {}, { page, pageSize, total }) {
  const perPage = Number(pagination.per_page) || pageSize || 20;
  const count = Number(pagination.total);
  const safeTotal = Number.isFinite(count) ? count : total;
  const currentPage = Number(pagination.current_page) || page || 1;
  const lastPage = Number(pagination.last_page) || Math.max(1, Math.ceil(safeTotal / perPage) || 1);

  return {
    total: safeTotal,
    page: currentPage,
    pageSize: perPage,
    totalPages: lastPage,
  };
}

function contactRowsFrom(result) {
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.contacts)) return result.data.contacts;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  return [];
}

function contactListParams({ page, pageSize, search, gender, location }) {
  const params = new URLSearchParams({
    page: String(page || 1),
    per_page: String(pageSize || 20),
  });
  const query = String(search || '').trim();
  if (query) params.set('search', query);
  if (gender) params.set('gender', gender);
  if (location) params.set('location', location);
  return params;
}

const contactListCache = new Map();
const contactListInFlight = new Map();
const CONTACT_LIST_CACHE_MS = 15000;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function clearContactListCache() {
  contactListCache.clear();
}

function contactListResult(result, collectionId, { page, pageSize }) {
  const rows = contactRowsFrom(result).map((item) =>
    mapContactFromApi(item, item?.collection_id || collectionId),
  );
  const pagination = result?.pagination || result?.meta || result?.data?.pagination || {};

  return {
    data: rows,
    meta: contactsMeta(pagination, { page, pageSize, total: rows.length }),
  };
}

async function fetchContactList(path, { token, tokenType, collectionId, page, pageSize, fresh = false }) {
  if (!fresh) {
    const cached = contactListCache.get(path);
    if (cached && Date.now() - cached.at < CONTACT_LIST_CACHE_MS) return cached.value;
    if (contactListInFlight.has(path)) return contactListInFlight.get(path);
  }

  const request = (async () => {
    let result;
    try {
      result = await apiRequest(path, { token, tokenType });
    } catch (error) {
      if (error?.status !== 429) throw error;
      await wait(error.retryAfterMs || 30000);
      result = await apiRequest(path, { token, tokenType });
    }

    const value = contactListResult(result, collectionId, { page, pageSize });
    contactListCache.set(path, { at: Date.now(), value });
    return value;
  })().finally(() => {
    contactListInFlight.delete(path);
  });

  contactListInFlight.set(path, request);
  return request;
}

/**
 * Contacts imported by one upload file.
 * GET /api/contacts/uploads/{upload_id}/contacts
 */
export async function listUploadContacts(
  uploadId,
  { page = 1, pageSize = 20, search = '', gender = '', location = '', token, tokenType, fresh = false } = {},
) {
  if (!uploadId) {
    return { data: [], meta: { total: 0, page: 1, pageSize, totalPages: 1 } };
  }
  if (!token) {
    throw new Error('Sign in to view contacts.');
  }

  const path = `/api/contacts/uploads/${encodeURIComponent(uploadId)}/contacts?${contactListParams({
    page,
    pageSize,
    search,
    gender,
    location,
  })}`;

  return fetchContactList(path, {
    token,
    tokenType,
    collectionId: null,
    page,
    pageSize,
    fresh,
  });
}

/**
 * Every contact in a collection.
 * GET /api/collections/{collection_id}/contacts
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
    token,
    tokenType,
    fresh = false,
  } = {},
) {
  if (uploadId) {
    return listUploadContacts(uploadId, {
      page,
      pageSize,
      search,
      gender,
      location,
      token,
      tokenType,
      fresh,
    });
  }

  if (!collectionId) {
    return { data: [], meta: { total: 0, page: 1, pageSize, totalPages: 1 } };
  }
  if (!token) {
    throw new Error('Sign in to view contacts.');
  }

  const path = `/api/collections/${encodeURIComponent(collectionId)}/contacts?${contactListParams({
    page,
    pageSize,
    search,
    gender,
    location,
  })}`;

  return fetchContactList(path, {
    token,
    tokenType,
    collectionId,
    page,
    pageSize,
    fresh,
  });
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
export const CONTACT_STATISTICS_QUERY_KEY = ['contact-statistics'];

export async function getContactStatistics({ token, tokenType } = {}) {
  if (!token) throw new Error('Sign in to view customer statistics.');
  const result = await apiRequest('/api/contacts/statistics', { token, tokenType });
  const data = result?.data && typeof result.data === 'object' ? result.data : {};
  const growth = data.customer_growth && typeof data.customer_growth === 'object' ? data.customer_growth : {};

  return {
    totalCategories: Number(data.total_categories) || 0,
    totalCollections: Number(data.total_collections) || 0,
    totalContacts: Number(data.total_contacts) || 0,
    growth: {
      currentMonth: Number(growth.current_month) || 0,
      previousMonth: Number(growth.previous_month) || 0,
      growthRate: growth.growth_rate == null || growth.growth_rate === '' ? null : Number(growth.growth_rate),
      period: growth.period || 'monthly',
    },
  };
}
