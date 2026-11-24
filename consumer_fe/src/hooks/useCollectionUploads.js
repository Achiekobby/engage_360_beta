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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
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
  const uploadsKey = collectionId
    ? [...COLLECTION_UPLOADS_QUERY_KEY, String(collectionId)]
    : COLLECTION_UPLOADS_QUERY_KEY;
  const contactCountKey = collectionId
    ? ['upload-contact-counts', String(collectionId)]
    : ['upload-contact-counts'];
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: uploadsKey }),
    queryClient.invalidateQueries({ queryKey: contactCountKey }),
  ]);
}

export function useCollectionUploadsClient() {
  return useQueryClient();
}
