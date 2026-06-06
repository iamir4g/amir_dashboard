import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { Garage } from '@/types/Garage';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isGarage = (value: unknown): value is Garage => {
  if (!isObject(value)) return false;
  return 'id' in value && 'name' in value;
};

const normalizeGaragesListResponse = (raw: unknown): Garage[] => {
  if (Array.isArray(raw)) {
    return raw.filter(isGarage);
  }

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data.filter(isGarage);
    }

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (Array.isArray(nested)) {
        return nested.filter(isGarage);
      }
    }
  }

  return [];
};

export const getAllGarages = async (): Promise<Garage[]> => {
  const raw = await readData<unknown>('/garages', undefined, 'Base');
  return normalizeGaragesListResponse(raw);
};

export const useGetAllGaragesQuery = (): UseQueryResult<Garage[], Error> => {
  return useQuery({
    queryKey: ['garages', 'list'],
    queryFn: getAllGarages,
  });
};
