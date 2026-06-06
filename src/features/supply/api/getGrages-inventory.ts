import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { GarageInventory, GetGarageInventoriesQueryParams } from '@/types/GarageInventory';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isGarageInventory = (value: unknown): value is GarageInventory => {
  if (!isObject(value)) return false;
  return 'id' in value && 'date' in value && 'start_time' in value && 'end_time' in value;
};

const normalizeGarageInventoriesListResponse = (raw: unknown): GarageInventory[] => {
  if (Array.isArray(raw)) {
    return raw.filter(isGarageInventory);
  }

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data.filter(isGarageInventory);
    }

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (Array.isArray(nested)) {
        return nested.filter(isGarageInventory);
      }
    }
  }

  return [];
};

const buildQueryString = (params: GetGarageInventoriesQueryParams): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
};

export const getGaragesInventoryList = async (
  params?: GetGarageInventoriesQueryParams
): Promise<GarageInventory[]> => {
  let url = '/garage-inventories';
  if (params) {
    const query = buildQueryString(params);
    if (query) {
      url += `?${query}`;
    }
  }

  const raw = await readData<unknown>(url, undefined, 'Base');
  return normalizeGarageInventoriesListResponse(raw);
};

export const useGetGaragesInventoryQuery = (
  params?: GetGarageInventoriesQueryParams
): UseQueryResult<GarageInventory[], Error> => {
  return useQuery({
    queryKey: ['garage-inventories', 'list', params],
    queryFn: () => getGaragesInventoryList(params),
    enabled: Boolean(params?.garage_id && params?.date),
  });
};
