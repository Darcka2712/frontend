'use client';

import useSWR from 'swr';
import { userService } from '@/lib/services/userService';

/**
 * Hook para gestionar el listado de usuarios con SWR (Cache & Revalidation)
 */
export function useUsers(filters = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    ['/api/usuario', filters],
    () => userService.getAll(filters)
  );

  return {
    users: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate
  };
}
