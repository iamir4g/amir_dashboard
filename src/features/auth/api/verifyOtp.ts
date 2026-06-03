import { useMutation, UseMutationResult } from '@tanstack/react-query';
import type { VerifyOtpRQ, VerifyOtpRS } from '@/types/auth';
import { createData } from '@/core/http-service';

const verifyOtp = (variables: VerifyOtpRQ): Promise<VerifyOtpRS> => {
  const url = `/auth/verify`;
  return createData(url, variables, undefined, true);
};

export const useVerifyOtpMutation = (): UseMutationResult<VerifyOtpRS, Error, VerifyOtpRQ> => {
  const mutation = useMutation({
    mutationKey: ['auth', 'verify-otp'],
    mutationFn: verifyOtp,
  });

  return mutation;
};
