import { useMemo } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  COLLECTION_CONTACTS_QUERY_KEY,
  clearContactListCache,
  listCollectionContacts,
} from '../services/customer-engagement/contacts';
import { useAppSelector } from '../store/hooks';

export function useCollectionContacts(collectionId, filters = {}) {
  const token = useAppSelector((state) => state.auth.user?.token);
  const tokenType = useAppSelector((state) => state.auth.user?.tokenType) || 'Bearer';
  const enabled = Boolean(collectionId && token);

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
    ],
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    queryFn: () => listCollectionContacts(collectionId, { ...filters, token, tokenType }),
  });

  const contacts = useMemo(() => {
    const rows = [...(query.data?.data || [])];
    const direction = filters.sortDir === 'asc' ? 1 : -1;
    const sort = filters.sort || 'registeredAt';
    rows.sort((left, right) => {
      const a = String(left?.[sort] ?? '').toLowerCase();
      const b = String(right?.[sort] ?? '').toLowerCase();
      if (a < b) return -1 * direction;
      if (a > b) return 1 * direction;
      return 0;
    });
    return rows;
  }, [filters.sort, filters.sortDir, query.data]);
  const meta = query.data?.meta || { total: 0, page: 1, pageSize: 25, totalPages: 1 };

  return {
    ...query,
    contacts,
    meta,
    total: meta.total || 0,
    totalPages: meta.totalPages || 1,
    isInitialLoading: query.isPending && !query.data,
    refetch: () => {
      clearContactListCache();
      return query.refetch();
    },
  };
}

export function useCollectionContactsClient() {
  return useQueryClient();
}

export function invalidateCollectionContacts(queryClient, collectionId) {
  clearContactListCache();
  if (!queryClient) return Promise.resolve();
  return queryClient.invalidateQueries({
    queryKey: collectionId
      ? [...COLLECTION_CONTACTS_QUERY_KEY, String(collectionId)]
      : COLLECTION_CONTACTS_QUERY_KEY,
  });
}
