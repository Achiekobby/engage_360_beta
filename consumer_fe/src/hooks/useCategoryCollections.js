import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategoryCollections } from '../services/customer-engagement/collections';
import { mapCollectionsFromApi } from '../components/customer-engagement/customers/customersData';
import { useAppSelector } from '../store/hooks';

export const CATEGORY_COLLECTIONS_QUERY_KEY = ['category-collections'];

export function useCategoryCollections(categoryId, category = null) {
  const token = useAppSelector((state) => state.auth.user?.token);
  const tokenType = useAppSelector((state) => state.auth.user?.tokenType) || 'Bearer';
  const enabled = Boolean(token && categoryId);

  const query = useQuery({
    queryKey: [...CATEGORY_COLLECTIONS_QUERY_KEY, String(categoryId || 'none'), token || 'guest'],
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (error?.status === 429) return false;
      return failureCount < 1;
    },
    queryFn: async () => {
      const result = await getCategoryCollections(categoryId, { token, tokenType });
      return mapCollectionsFromApi(result?.data, category);
    },
  });

  const collections = useMemo(() => {
    const list = query.data || [];
    if (!category) return list;

    return list.map((item) => ({
      ...item,
      categoryId: item.categoryId ?? category.id,
      category: item.category || category.name || '',
    }));
  }, [query.data, category]);

  return {
    ...query,
    collections,
    token,
    tokenType,
  };
}

export function useCategoryCollectionsClient() {
  return useQueryClient();
}
