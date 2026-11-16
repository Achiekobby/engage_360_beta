import { useQuery } from '@tanstack/react-query';
import { getBusinessCategories } from '../services/businessCategories';

export const BUSINESS_CATEGORIES_QUERY_KEY = ['business-categories'];

export function useBusinessCategories() {
  return useQuery({
    queryKey: BUSINESS_CATEGORIES_QUERY_KEY,
    queryFn: getBusinessCategories,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
