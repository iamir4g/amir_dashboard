import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type {
  BookingInspectionByDateItem,
  BookingInspectionByDateMap,
  GetBookInspectionByDateQueryParams,
} from '@/types/BookingInspection';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isBookingInspectionByDateItem = (value: unknown): value is BookingInspectionByDateItem => {
  if (!isObject(value)) return false;
  return 'id' in value && 'status' in value;
};

const isBookingInspectionByDateMap = (value: unknown): value is BookingInspectionByDateMap => {
  if (!isObject(value)) return false;
  const entries = Object.entries(value);
  if (entries.length === 0) return true;
  return entries.every(([key, v]) => typeof key === 'string' && Array.isArray(v));
};

const groupArrayByDate = (items: unknown[]): BookingInspectionByDateMap => {
  const grouped: BookingInspectionByDateMap = {};

  items.forEach((rawItem) => {
    if (!isBookingInspectionByDateItem(rawItem)) return;

    const item = rawItem as unknown as Record<string, unknown>;
    const garageInventory = isObject(item.garage_inventory)
      ? (item.garage_inventory as any)
      : undefined;
    const inventory = isObject(item.inventory) ? (item.inventory as any) : undefined;

    const rawDate =
      (typeof garageInventory?.date === 'string' && garageInventory.date) ||
      (typeof inventory?.date === 'string' && inventory.date) ||
      '';

    const dateKey = rawDate ? rawDate.slice(0, 10) : 'unknown';
    grouped[dateKey] = grouped[dateKey] ?? [];
    grouped[dateKey]!.push(rawItem);
  });

  return grouped;
};

const normalizeBookingInspectionByDateResponse = (raw: unknown): BookingInspectionByDateMap => {
  if (Array.isArray(raw)) {
    return groupArrayByDate(raw);
  }

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;

    if (isBookingInspectionByDateMap(data)) {
      return data;
    }

    if (isBookingInspectionByDateMap(raw)) {
      return raw;
    }
  }

  return {};
};

const buildQueryString = (params: GetBookInspectionByDateQueryParams): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
};

export const getBookInspectionByDateMap = async (
  params?: GetBookInspectionByDateQueryParams
): Promise<BookingInspectionByDateMap> => {
  let url = '/booking-inspection/by-date';

  if (params) {
    const query = buildQueryString(params);
    if (query) {
      url += `?${query}`;
    }
  }

  const raw = await readData<unknown>(url, undefined, 'Base');
  return normalizeBookingInspectionByDateResponse(raw);
};

export const useGetBookInspectionByDateQuery = (
  params?: GetBookInspectionByDateQueryParams
): UseQueryResult<BookingInspectionByDateMap, Error> => {
  return useQuery({
    queryKey: ['booking-inspection', 'by-date', params],
    queryFn: () => getBookInspectionByDateMap(params),
  });
};
