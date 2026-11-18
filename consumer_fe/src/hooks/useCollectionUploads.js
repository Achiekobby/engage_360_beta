import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  COLLECTION_UPLOADS_QUERY_KEY,
  listCollectionUploads,
} from '../services/customer-engagement/contactImport';
import { useAppSelector } from '../store/hooks';

export function useCollectionUploads(collectionId) {
  const token = useAppSelector((state) => state.auth.user?.token);
  const tokenType = useAppSelector((state) => state.auth.user?.tokenType) || 'Bearer';
  const enabled = Boolean(collectionId && token);

  const query = useQuery({
    queryKey: [...COLLECTION_UPLOADS_QUERY_KEY, String(collectionId || 'none'), token || 'guest'],
    enabled,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (error?.status === 429) return false;
      return failureCount < 1;
    },
    queryFn: () => listCollectionUploads(collectionId, { token, tokenType }),
  });

  return {
    ...query,
    uploads: query.data || [],
  };
}

export function invalidateCollectionUploads(queryClient, collectionId) {
  if (!queryClient) return Promise.resolve();
  return queryClient.invalidateQueries({
    queryKey: collectionId
      ? [...COLLECTION_UPLOADS_QUERY_KEY, String(collectionId)]
      : COLLECTION_UPLOADS_QUERY_KEY,
  });
}

export function useCollectionUploadsClient() {
  return useQueryClient();
}
