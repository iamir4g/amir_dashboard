import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { Brand } from '@/types/Cars';

export type GetAllBrandQueryParams = {
  page?: number;
  page_size?: number;
  name_en?: string;
  ids?: string;
  status?: string;
  order?: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isBrand = (value: unknown): value is Brand => {
  if (!isObject(value)) return false;
  return 'id' in value && 'name_fa' in value;
};

const normalizeBrandListResponse = (raw: unknown): Brand[] => {
  if (Array.isArray(raw)) {
    return raw.filter(isBrand);
  }

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data.filter(isBrand);
    }

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (Array.isArray(nested)) {
        return nested.filter(isBrand);
      }
    }
  }

  return [];
};

const buildQueryString = (params: GetAllBrandQueryParams): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
};

export const getAllBrands = async (params?: GetAllBrandQueryParams): Promise<Brand[]> => {
  let url = '/brands';
  const query = buildQueryString({ page_size: 0, ...(params ?? {}) });
  if (query) url += `?${query}`;

  const raw = await readData<unknown>(url, undefined, 'Base');
  return normalizeBrandListResponse(raw);
};

export const useGetAllBrandQuery = (
  params?: GetAllBrandQueryParams,
  options?: { enabled?: boolean }
): UseQueryResult<Brand[], Error> => {
  return useQuery({
    queryKey: ['brands', 'list', params],
    queryFn: () => getAllBrands(params),
    enabled: options?.enabled ?? true,
  });
};
