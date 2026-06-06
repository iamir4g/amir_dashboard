import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { Admin } from '@/types/Admin';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isAdmin = (value: unknown): value is Admin => {
  if (!isObject(value)) return false;
  return 'id' in value;
};

const normalizeAdminsListResponse = (raw: unknown): Admin[] => {
  if (Array.isArray(raw)) {
    return raw.filter(isAdmin);
  }

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data.filter(isAdmin);
    }

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (Array.isArray(nested)) {
        return nested.filter(isAdmin);
      }
    }
  }

  return [];
};

export const getAllAdmins = async (): Promise<Admin[]> => {
  const raw = await readData<unknown>('/admins', undefined, 'Base');
  return normalizeAdminsListResponse(raw);
};

export const useGetAllAdminsQuery = (): UseQueryResult<Admin[], Error> => {
  return useQuery({
    queryKey: ['admins', 'list'],
    queryFn: getAllAdmins,
  });
};
