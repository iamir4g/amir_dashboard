import ApiService from '@/services/ApiService';
import { SignInResponse } from '@/types/auth';

export const AuthService = {
  async signIn(email: string, password: string): Promise<SignInResponse> {
    const res = await ApiService.fetchData<{ email: string; password: string }, SignInResponse>({
      url: '/users/sign-in',
      method: 'POST',
      data: { email, password },
    });
    return res.data;
  },
  async signOut(): Promise<boolean> {
    const res = await ApiService.fetchData<undefined, boolean>({
      url: '/sign-out',
      method: 'POST',
    });
    return res.data;
  },
};
