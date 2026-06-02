import { useMutation } from '@tanstack/react-query';

export const signOutMutationKey = ['auth', 'sign-out'] as const;

export const useSignOutMutation = () =>
  useMutation({
    mutationKey: signOutMutationKey,
    mutationFn: async (): Promise<boolean> => true,
  });
