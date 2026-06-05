import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { Note } from '@/types/Cars';

export type GetAllNoteCarQueryParams = {
  page?: number;
  page_size?: number;
  order?: string;
  ids?: Array<number | string>;
  car_v2_id?: number;
  admin_id?: number;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNote = (value: unknown): value is Note => {
  if (!isObject(value)) return false;
  return 'id' in value && 'text' in value && 'car_v2_id' in value;
};

const normalizeNotesListResponse = (raw: unknown): Note[] => {
  if (Array.isArray(raw)) {
    return raw.filter(isNote);
  }

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data.filter(isNote);
    }

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (Array.isArray(nested)) {
        return nested.filter(isNote);
      }
    }
  }

  return [];
};

const buildNotesQueryString = (params: GetAllNoteCarQueryParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null || item === '') return;
        searchParams.append(key, String(item));
      });
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString();
};

export const getAllNoteCar = async (params: GetAllNoteCarQueryParams): Promise<Note[]> => {
  let url = `/notes`;
  const queryString = buildNotesQueryString(params);
  if (queryString) {
    url += `?${queryString}`;
  }

  const raw = await readData<unknown>(url, undefined, 'Base');
  return normalizeNotesListResponse(raw);
};

export const useGetAllNoteCarQuery = (
  params?: GetAllNoteCarQueryParams
): UseQueryResult<Note[], Error> => {
  return useQuery({
    queryKey: ['notes', 'list', params?.car_v2_id, params],
    queryFn: () => (params ? getAllNoteCar(params) : Promise.resolve([])),
    enabled: Boolean(params?.car_v2_id),
  });
};
