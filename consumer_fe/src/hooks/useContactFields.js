import { useQuery } from '@tanstack/react-query';
import {
  RECOMMENDED_FIELDS,
  STANDARD_FIELDS,
  getContactFields,
} from '../services/customer-engagement/contactFields';
import { useAppSelector } from '../store/hooks';

export function useContactFields(enabled = true) {
  const token = useAppSelector((state) => state.auth.user?.token);
  const tokenType = useAppSelector((state) => state.auth.user?.tokenType) || 'Bearer';

  const query = useQuery({
    queryKey: ['contact-fields', token || 'guest'],
    queryFn: () => getContactFields({ token, tokenType }),
    enabled: Boolean(enabled && token),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (error?.status === 429) return false;
      return failureCount < 1;
    },
  });

  // Only use the static fallback when the request failed. A successful empty
  // recommended list must not replace server fields with id-less placeholders,
  // or Save configuration stays disabled.
  const recommended = !query.isFetched
    ? []
    : query.data?.recommended?.length
      ? query.data.recommended
      : query.isError
        ? RECOMMENDED_FIELDS
        : [];

  return {
    ...query,
    standard: query.data?.standard?.length ? query.data.standard : STANDARD_FIELDS,
    recommended,
    custom: query.data?.custom || [],
  };
}
