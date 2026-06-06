import { createData } from '@/core/http-service';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import type { BookingInspection, CreateBookingInspectionRQ } from '@/types/BookingInspection';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isBookingInspection = (value: unknown): value is BookingInspection => {
  if (!isObject(value)) return false;
  return 'id' in value && 'status' in value;
};

const normalizeCreateBookingInspectionResponse = (raw: unknown): BookingInspection => {
  if (isBookingInspection(raw)) return raw;

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (isBookingInspection(data)) return data;

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (isBookingInspection(nested)) return nested;
    }
  }

  return raw as BookingInspection;
};

export const postBookInspection = async (
  data: CreateBookingInspectionRQ
): Promise<BookingInspection> => {
  const url = '/booking-inspection';
  const raw = await createData<CreateBookingInspectionRQ, unknown>(url, data, undefined, false);
  return normalizeCreateBookingInspectionResponse(raw);
};

export const usePostBookInspectionMutation = (): UseMutationResult<
  BookingInspection,
  Error,
  CreateBookingInspectionRQ
> => {
  return useMutation({
    mutationKey: ['booking-inspection', 'create'],
    mutationFn: postBookInspection,
  });
};
