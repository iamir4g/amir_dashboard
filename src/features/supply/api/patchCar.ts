import { patchData } from '@/core/http-service';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export type PatchCarBody = {
  admin_id?: number;
  status?: string;
  brand_id?: number;
  model_id?: number;
  trim_id?: number;
  make_year?: number;
  color?: string;
  mileage?: number;
};

export type PatchCarParams = {
  id: number;
  body: PatchCarBody;
};

export const patchCar = async ({ id, body }: PatchCarParams): Promise<void> => {
  const url = `/cars/${id}`;
  await patchData<PatchCarBody, unknown>(url, body, undefined, false);
};

export const usePatchCarMutation = (): UseMutationResult<void, Error, PatchCarParams> => {
  return useMutation({
    mutationKey: ['cars', 'patch'],
    mutationFn: patchCar,
  });
};
