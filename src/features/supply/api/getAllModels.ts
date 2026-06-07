import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { CarModel } from '@/types/Cars';

export type GetAllModelsQueryParams = {
  brand_id: number;
  page?: number;
  page_size?: number;
  status?: string;
  ids?: string;
  order?: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isModel = (value: unknown): value is CarModel => {
  if (!isObject(value)) return false;
  return 'id' in value && 'brand_id' in value && 'name_fa' in value;
};

const normalizeModelListResponse = (raw: unknown): CarModel[] => {
  if (Array.isArray(raw)) {
    return raw.filter(isModel);
  }

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data.filter(isModel);
    }

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (Array.isArray(nested)) {
        return nested.filter(isModel);
      }
    }
  }

  return [];
};

const buildQueryString = (params: GetAllModelsQueryParams): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
};

export const getAllModels = async (params: GetAllModelsQueryParams): Promise<CarModel[]> => {
  let url = '/models';
  const query = buildQueryString({ page_size: 0, ...params });
  if (query) url += `?${query}`;

  const raw = await readData<unknown>(url, undefined, 'Base');
  return normalizeModelListResponse(raw);
};

export const useGetAllModelsQuery = (
  params?: GetAllModelsQueryParams
): UseQueryResult<CarModel[], Error> => {
  return useQuery({
    queryKey: ['models', 'list', params?.brand_id, params],
    queryFn: () => getAllModels(params as GetAllModelsQueryParams),
    enabled: Boolean(params?.brand_id),
  });
};
