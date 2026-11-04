import { useMemo } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  COLLECTION_CONTACTS_QUERY_KEY,
  listCollectionContacts,
} from '../services/customer-engagement/contacts';

export function useCollectionContacts(collectionId, filters = {}) {
  const enabled = Boolean(collectionId);

  const query = useQuery({
    queryKey: [
      ...COLLECTION_CONTACTS_QUERY_KEY,
      String(collectionId || 'none'),
      filters.page || 1,
      filters.pageSize || 25,
      filters.search || '',
      filters.gender || '',
      filters.location || '',
      filters.uploadId || '',
      filters.sort || 'registeredAt',
      filters.sortDir || 'desc',
    ],
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: () => listCollectionContacts(collectionId, filters),
  });

  const contacts = useMemo(() => query.data?.data || [], [query.data]);
  const meta = query.data?.meta || { total: 0, page: 1, pageSize: 25, totalPages: 1 };

  return {
    ...query,
    contacts,
    meta,
    total: meta.total || 0,
    totalPages: meta.totalPages || 1,
    isInitialLoading: query.isPending && !query.data,
  };
}

export function useCollectionContactsClient() {
  return useQueryClient();
}

export function invalidateCollectionContacts(queryClient, collectionId) {
  if (!queryClient) return Promise.resolve();
  return queryClient.invalidateQueries({
    queryKey: collectionId
      ? [...COLLECTION_CONTACTS_QUERY_KEY, String(collectionId)]
      : COLLECTION_CONTACTS_QUERY_KEY,
  });
}
