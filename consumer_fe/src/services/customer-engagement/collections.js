import { apiRequest } from '../api/request';

const inFlightByCategory = new Map();

export async function getCategoryCollections(categoryId, { token, tokenType } = {}) {
  const key = String(categoryId);
  if (!key || key === 'undefined' || key === 'null') {
    return { success: true, data: [] };
  }

  if (inFlightByCategory.has(key)) {
    return inFlightByCategory.get(key);
  }

  const request = apiRequest(`/api/categories/${key}/collections`, {
    token,
    tokenType,
  }).finally(() => {
    inFlightByCategory.delete(key);
  });

  inFlightByCategory.set(key, request);
  return request;
}

export async function createCollection({ categoryId, name }, { token, tokenType } = {}) {
  return apiRequest('/api/collections', {
    method: 'POST',
    token,
    tokenType,
    body: {
      category_id: categoryId,
      name: String(name || '').trim(),
    },
  });
}

export async function updateCollection(
  collectionId,
  { name, categoryId },
  { token, tokenType } = {},
) {
  const body = {
    name: String(name || '').trim(),
  };

  if (categoryId != null && categoryId !== '') {
    body.category_id = categoryId;
  }

  return apiRequest(`/api/collections/${collectionId}`, {
    method: 'PATCH',
    token,
    tokenType,
    body,
  });
}

export async function deleteCollection(collectionId, { token, tokenType } = {}) {
  if (!collectionId) throw new Error('Missing collection id.');
  return apiRequest(`/api/contacts/uploads/${encodeURIComponent(collectionId)}`, {
    method: 'DELETE',
    token,
    tokenType,
  });
}
