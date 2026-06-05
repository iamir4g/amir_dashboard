import { patchData } from '@/core/http-service';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export type PatchCarBody = {
  admin_id?: number;
  status?: string;
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
