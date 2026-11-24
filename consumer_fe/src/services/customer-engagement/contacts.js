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

export function readCategoryName(value) {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (typeof value === 'object') {
    return readCategoryName(value.name || value.label || value.title || value.category_name);
  }
  return '';
}

function readCollectionName(item) {
  return (
    readCategoryName(item.collection_name) ||
    readCategoryName(item.collectionName) ||
    readCategoryName(item.collection?.name) ||
    ''
  );
}

function readContactCategory(item, customFields = {}) {
  return (
    readCategoryName(item.category_name) ||
    readCategoryName(item.categoryName) ||
    readCategoryName(item.category) ||
    readCategoryName(item.collection?.category_name) ||
    readCategoryName(item.collection?.category) ||
    readCategoryName(customFields.category_name) ||
    readCategoryName(customFields.category) ||
    ''
  );
}

function readIsActive(value) {
  if (value == null || value === '') return true;
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  return Boolean(value);
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
    category: readContactCategory(item, customFields),
    subCategory: item.sub_category || item.subCategory || '',
    segment:
      item.segment || item.customer_segment || customFields.customer_type || customFields.segment || '',
    registeredAt:
      formatContactDate(item.registeredAt || item.registered_at || item.created_at || '') ||
      new Date().toLocaleString('en-GB'),
    customerSince: item.customer_since || item.customerSince || '',
    whatsapp: item.whatsapp || phone,
    imageUrl: item.image_url || item.imageUrl || null,
    notes: Array.isArray(item.notes) ? item.notes : [],
    custom_fields: customFields,
    isActive: readIsActive(item.is_active),
    collectionId: String(item.collection_id || item.collectionId || collectionId || ''),
    collectionName: readCollectionName(item),
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

const uploadContactCountCache = new Map();
const uploadContactCountInFlight = new Map();
const UPLOAD_CONTACT_COUNT_CACHE_MS = 1000 * 60 * 5;

export function clearContactListCache() {
  contactListCache.clear();
  uploadContactCountCache.clear();
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

/** How many contacts are currently listed under one upload file. One request, then cached. */
export async function countContactsForUpload(uploadId, { token, tokenType } = {}) {
  if (!uploadId) return 0;
  const key = String(uploadId);
  const cached = uploadContactCountCache.get(key);
  if (cached && Date.now() - cached.at < UPLOAD_CONTACT_COUNT_CACHE_MS) return cached.count;
  if (uploadContactCountInFlight.has(key)) return uploadContactCountInFlight.get(key);

  const request = (async () => {
    const result = await listUploadContacts(uploadId, {
      page: 1,
      pageSize: 100,
      token,
      tokenType,
    });
    const rows = result?.data?.length || 0;
    const reported = Number(result?.meta?.total);
    const count = Number.isFinite(reported) && reported >= rows ? reported : rows;
    uploadContactCountCache.set(key, { at: Date.now(), count });
    return count;
  })().finally(() => {
    uploadContactCountInFlight.delete(key);
  });

  uploadContactCountInFlight.set(key, request);
  return request;
}

/** Contacts found under each upload, counted once per upload list. */
export async function countContactsAcrossUploads(uploadIds, { token, tokenType } = {}) {
  let count = 0;
  for (const uploadId of uploadIds || []) {
    count += await countContactsForUpload(uploadId, { token, tokenType });
  }
  return count;
}

/**
 * DELETE /api/contacts/{contact_id}
 */
export async function deleteContact(contactId, { token, tokenType } = {}) {
  if (!contactId) throw new Error('Missing contact id.');
  if (!token) throw new Error('Sign in to delete a contact.');
  return apiRequest(`/api/contacts/${encodeURIComponent(contactId)}`, {
    method: 'DELETE',
    token,
    tokenType,
  });
}

const CONTACT_CORE_KEYS = new Set(['first_name', 'last_name', 'phone_number']);

function contactAttributeValue(value) {
  if (typeof value === 'string') return value.trim();
  return value;
}

/**
 * PATCH /api/contacts/{contact_id}
 * Profile updates send first_name, last_name, phone_number, and other fields in attributes.
 * A status change sends is_active as 1 or 0.
 */
export async function updateContact(contactId, payload = {}, { token, tokenType } = {}) {
  if (!contactId) throw new Error('Missing contact id.');
  if (!token) throw new Error('Sign in to update a contact.');

  const keys = Object.keys(payload);
  const statusOnly = keys.length > 0 && keys.every((key) => key === 'is_active');
  if (statusOnly) {
    const isActive = payload.is_active === true || payload.is_active === 1 || payload.is_active === '1';
    return apiRequest(`/api/contacts/${encodeURIComponent(contactId)}`, {
      method: 'PATCH',
      token,
      tokenType,
      body: { is_active: isActive ? 1 : 0 },
    });
  }

  const body = {};
  if (payload.first_name != null) body.first_name = String(payload.first_name).trim();
  if (payload.last_name != null) body.last_name = String(payload.last_name).trim();
  if (payload.phone_number != null) {
    body.phone_number = String(payload.phone_number).replace(/\D/g, '');
  }

  const attributes = {};
  const supplied = payload.attributes;
  if (supplied && typeof supplied === 'object' && !Array.isArray(supplied)) {
    Object.entries(supplied).forEach(([key, value]) => {
      if (value == null || String(value).trim() === '') return;
      attributes[key] = contactAttributeValue(value);
    });
  }
  Object.entries(payload).forEach(([key, value]) => {
    if (
      CONTACT_CORE_KEYS.has(key) ||
      key === 'attributes' ||
      key === 'is_active' ||
      key === 'collection_id' ||
      key === 'collectionId' ||
      key === 'contact_file_id' ||
      key === 'uploadId' ||
      key === 'id'
    ) {
      return;
    }
    if (value == null || String(value).trim() === '') return;
    attributes[key] = contactAttributeValue(value);
  });
  if (Object.keys(attributes).length) body.attributes = attributes;

  if (Object.prototype.hasOwnProperty.call(payload, 'is_active')) {
    const isActive = payload.is_active === true || payload.is_active === 1 || payload.is_active === '1';
    body.is_active = isActive ? 1 : 0;
  }

  return apiRequest(`/api/contacts/${encodeURIComponent(contactId)}`, {
    method: 'PATCH',
    token,
    tokenType,
    body,
  });
}

/**
 * POST /api/add-contact
 * Required: collection_id, first_name, last_name, phone_number.
 * Any other saved column with a value is included on the same body.
 */
export async function addContact(payload = {}, { token, tokenType } = {}) {
  if (!token) throw new Error('Sign in to add a contact.');
  const collectionId = payload.collection_id || payload.collectionId;
  if (!collectionId) throw new Error('Choose a collection for this contact.');

  const body = { collection_id: String(collectionId) };
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'collection_id' || key === 'collectionId' || key === 'contact_file_id' || key === 'uploadId') {
      return;
    }
    if (value == null || String(value).trim() === '') return;
    body[key] = typeof value === 'string' ? value.trim() : value;
  });

  if (!body.first_name || !body.last_name || !body.phone_number) {
    throw new Error('First name, last name, and phone number are required.');
  }

  return apiRequest('/api/add-contact', {
    method: 'POST',
    token,
    tokenType,
    body,
  });
}

export const COLLECTION_CONTACTS_QUERY_KEY = ['collection-contacts'];
export const CONTACT_STATISTICS_QUERY_KEY = ['contact-statistics', 'rate'];

function readCount(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

/** Prefer the API rate. When it is null, derive it from this month and last month. */
function readGrowthRate(growth) {
  const raw = growth?.growth_rate;
  if (raw != null && String(raw).trim() !== '') {
    const parsed = Number(String(raw).replace(/%/g, '').trim());
    if (Number.isFinite(parsed)) return parsed;
  }

  const current = readCount(growth?.current_month);
  const previous = readCount(growth?.previous_month);
  if (previous <= 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export async function getContactStatistics({ token, tokenType } = {}) {
  if (!token) throw new Error('Sign in to view customer statistics.');
  const result = await apiRequest('/api/contacts/statistics', { token, tokenType });
  const data = result?.data && typeof result.data === 'object' ? result.data : {};
  const growth = data.customer_growth && typeof data.customer_growth === 'object' ? data.customer_growth : {};
  const currentMonth = readCount(growth.current_month);
  const previousMonth = readCount(growth.previous_month);

  return {
    totalCategories: readCount(data.total_categories),
    totalCollections: readCount(data.total_collections),
    totalContacts: readCount(data.total_contacts),
    growth: {
      currentMonth,
      previousMonth,
      growthRate: readGrowthRate(growth),
      period: growth.period || 'monthly',
    },
  };
}
