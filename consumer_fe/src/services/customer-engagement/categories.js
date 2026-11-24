import { apiRequest } from '../api/request';

let inFlightGetCategories = null;
let cachedCategoriesResult = null;
let cachedCategoriesAt = 0;
let rateLimitedUntil = 0;

const CACHE_TTL_MS = 1000 * 60 * 10;
const RATE_LIMIT_COOLDOWN_MS = 1000 * 60;

export async function getCategories({ token, tokenType, force = false } = {}) {
  const now = Date.now();

  if (!force && rateLimitedUntil > now) {
    if (cachedCategoriesResult) return cachedCategoriesResult;
    const waitSec = Math.ceil((rateLimitedUntil - now) / 1000);
    const error = new Error(
      `Too many category requests. Wait about ${waitSec}s, then try again.`,
    );
    error.status = 429;
    throw error;
  }

  if (!force && cachedCategoriesResult && now - cachedCategoriesAt < CACHE_TTL_MS) {
    return cachedCategoriesResult;
  }

  if (!force && inFlightGetCategories) {
    return inFlightGetCategories;
  }

  inFlightGetCategories = apiRequest('/api/get-categories', { token, tokenType })
    .then((result) => {
      cachedCategoriesResult = result;
      cachedCategoriesAt = Date.now();
      rateLimitedUntil = 0;
      return result;
    })
    .catch((error) => {
      if (error?.status === 429) {
        rateLimitedUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
        if (cachedCategoriesResult) return cachedCategoriesResult;
      }
      throw error;
    })
    .finally(() => {
      inFlightGetCategories = null;
    });

  return inFlightGetCategories;
}

export function invalidateCategoriesCache({ clearRateLimit = false } = {}) {
  cachedCategoriesResult = null;
  cachedCategoriesAt = 0;
  inFlightGetCategories = null;
  if (clearRateLimit) rateLimitedUntil = 0;
}

export function seedCategoriesCache(result) {
  cachedCategoriesResult = result;
  cachedCategoriesAt = Date.now();
  rateLimitedUntil = 0;
}

export async function createCategory({ name, description }, { token, tokenType } = {}) {
  const result = await apiRequest('/api/categories', {
    method: 'POST',
    token,
    tokenType,
    body: {
      name: String(name || '').trim(),
      description: String(description || '').trim(),
    },
  });

  invalidateCategoriesCache();
  return result;
}

export async function updateCategory(
  categoryId,
  { name, description },
  { token, tokenType } = {},
) {
  const result = await apiRequest(`/api/categories/${categoryId}`, {
    method: 'PATCH',
    token,
    tokenType,
    body: {
      name: String(name || '').trim(),
      description: String(description || '').trim(),
    },
  });

  invalidateCategoriesCache();
  return result;
}

export async function deleteCategory(categoryId, { token, tokenType } = {}) {
  if (!categoryId) throw new Error('Missing category id.');
  const result = await apiRequest(`/api/categories/${encodeURIComponent(categoryId)}`, {
    method: 'DELETE',
    token,
    tokenType,
  });

  invalidateCategoriesCache();
  return result;
}
