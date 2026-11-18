import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CONTACT_STATISTICS_QUERY_KEY,
  getContactStatistics,
} from '../services/customer-engagement/contacts';
import { useAppSelector } from '../store/hooks';

export function useContactStatistics() {
  const token = useAppSelector((state) => state.auth.user?.token);
  const tokenType = useAppSelector((state) => state.auth.user?.tokenType) || 'Bearer';

  const query = useQuery({
    queryKey: [...CONTACT_STATISTICS_QUERY_KEY, token || 'guest'],
    enabled: Boolean(token),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (error?.status === 429) return false;
      return failureCount < 1;
    },
    queryFn: () => getContactStatistics({ token, tokenType }),
  });

  return {
    ...query,
    statistics: query.data || null,
  };
}

export function invalidateContactStatistics(queryClient) {
  if (!queryClient) return Promise.resolve();
  return queryClient.invalidateQueries({ queryKey: CONTACT_STATISTICS_QUERY_KEY });
}

export function useContactStatisticsClient() {
  return useQueryClient();
}
