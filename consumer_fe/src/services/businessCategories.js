import { apiRequest } from './api/request';

export async function getBusinessCategories() {
  const result = await apiRequest('/api/businesses-categories');
  const rows = Array.isArray(result?.data) ? result.data : [];

  return rows
    .map((row) => ({
      id: row?.id == null ? '' : String(row.id),
      name: typeof row?.name === 'string' ? row.name.trim() : '',
      description: typeof row?.description === 'string' ? row.description.trim() : '',
    }))
    .filter((row) => row.id && row.name);
}
