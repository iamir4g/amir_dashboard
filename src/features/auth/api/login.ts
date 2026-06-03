import { createData } from '@/core/http-service';
import type { SendOtpRS, SendOtpRQ } from '@/types/auth';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export const postLogin = (data: SendOtpRQ): Promise<SendOtpRS> => {
  const url = `/auth/login`;
  return createData(url, data, undefined, true);
};

export const usePostLoginMutation = (): UseMutationResult<SendOtpRS, Error, SendOtpRQ> => {
  const mutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: postLogin,
  });

  return mutation;
};
