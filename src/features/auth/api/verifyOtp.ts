import { useMutation } from '@tanstack/react-query';
import type { VerifyOtpRQ, VerifyOtpRS } from '@/types/auth';
import { AuthService } from '@/features/auth/services/auth.service';

export const verifyOtpMutationKey = ['auth', 'verify-otp'] as const;

export const useVerifyOtpMutation = () =>
  useMutation({
    mutationKey: verifyOtpMutationKey,
    mutationFn: (variables: VerifyOtpRQ): Promise<VerifyOtpRS> => AuthService.verify(variables),
  });
