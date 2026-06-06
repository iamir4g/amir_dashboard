import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { BookingInspection, GetBookInspectionQueryParams } from '@/types/BookingInspection';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isBookingInspection = (value: unknown): value is BookingInspection => {
  if (!isObject(value)) return false;
  return 'id' in value && 'status' in value;
};

const normalizeBookingInspectionListResponse = (raw: unknown): BookingInspection[] => {
  if (Array.isArray(raw)) {
    return raw.filter(isBookingInspection);
  }

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data.filter(isBookingInspection);
    }

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (Array.isArray(nested)) {
        return nested.filter(isBookingInspection);
      }
    }
  }

  return [];
};

const buildQueryString = (params: GetBookInspectionQueryParams): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
};

export const getBookInspectionList = async (
  params?: GetBookInspectionQueryParams
): Promise<BookingInspection[]> => {
  let url = '/booking-inspection';
  if (params) {
    const query = buildQueryString(params);
    if (query) {
      url += `?${query}`;
    }
  }

  const raw = await readData<unknown>(url, undefined, 'Base');
  return normalizeBookingInspectionListResponse(raw);
};

export const useGetBookInspectionQuery = (
  params?: GetBookInspectionQueryParams
): UseQueryResult<BookingInspection[], Error> => {
  return useQuery({
    queryKey: ['booking-inspection', 'list', params],
    queryFn: () => getBookInspectionList(params),
  });
};
