import { createData } from '@/core/http-service';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import type { CarOperator, CreateCarOperatorRQ } from '@/types/CarOperator';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isCarOperator = (value: unknown): value is CarOperator => {
  if (!isObject(value)) return false;
  return 'id' in value && 'car_v2_id' in value;
};

const normalizeCreateCarOperatorResponse = (raw: unknown): CarOperator => {
  if (isCarOperator(raw)) return raw;

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (isCarOperator(data)) return data;

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (isCarOperator(nested)) return nested;
    }
  }

  return raw as CarOperator;
};

export const postOperators = async (data: CreateCarOperatorRQ): Promise<CarOperator> => {
  const url = '/operators';
  const raw = await createData<CreateCarOperatorRQ, unknown>(url, data, undefined, false);
  return normalizeCreateCarOperatorResponse(raw);
};

export const usePostOperatorsMutation = (): UseMutationResult<
  CarOperator,
  Error,
  CreateCarOperatorRQ
> => {
  return useMutation({
    mutationKey: ['operators', 'create'],
    mutationFn: postOperators,
  });
};
