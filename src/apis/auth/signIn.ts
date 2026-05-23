import { useMutation } from '@tanstack/react-query'
import type { SignInCredential, SignInResponse } from '@/@types/auth'
import { AuthService } from '@/services/auth/auth.service'

export const signInMutationKey = ['auth', 'sign-in'] as const

export const useSignInMutation = () =>
  useMutation({
    mutationKey: signInMutationKey,
    mutationFn: (variables: SignInCredential): Promise<SignInResponse> =>
      AuthService.signIn(variables.email, variables.password),
  })
