import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/features/auth/services/auth.service';

export const signOutMutationKey = ['auth', 'sign-out'] as const;

export const useSignOutMutation = () =>
  useMutation({
    mutationKey: signOutMutationKey,
    mutationFn: (): Promise<boolean> => AuthService.signOut(),
  });
