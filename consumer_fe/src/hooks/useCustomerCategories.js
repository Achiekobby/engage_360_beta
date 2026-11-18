import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories } from '../services/customer-engagement/categories';
import { mapCategoriesFromApi } from '../components/customer-engagement/customers/customersData';
import { useAppSelector } from '../store/hooks';

export const CUSTOMER_CATEGORIES_QUERY_KEY = ['customer-categories', 'counts'];

export function useCustomerCategories() {
  const token = useAppSelector((state) => state.auth.user?.token);
  const tokenType = useAppSelector((state) => state.auth.user?.tokenType) || 'Bearer';

  const query = useQuery({
    queryKey: [...CUSTOMER_CATEGORIES_QUERY_KEY, token || 'guest'],
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (error?.status === 429) return false;
      return failureCount < 1;
    },
    queryFn: async () => {
      const result = await getCategories({ token, tokenType });
      return mapCategoriesFromApi(result?.data);
    },
  });

  return {
    ...query,
    categories: query.data || [],
    token,
    tokenType,
  };
}

export function useCustomerCategoriesClient() {
  return useQueryClient();
}
