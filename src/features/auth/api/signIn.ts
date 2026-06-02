import { useMutation } from '@tanstack/react-query';
import type { SignInCredential, SendOtpRS } from '@/types/auth';
import { AuthService } from '@/features/auth/services/auth.service';

export const signInMutationKey = ['auth', 'sign-in'] as const;

export const useSignInMutation = () =>
  useMutation({
    mutationKey: signInMutationKey,
    mutationFn: (variables: SignInCredential): Promise<SendOtpRS> =>
      AuthService.login({ phone: variables.phone }),
  });
