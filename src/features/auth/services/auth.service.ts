import ApiService from '@/services/ApiService';
import type { SendOtpRQ, SendOtpRS, VerifyOtpRQ, VerifyOtpRS } from '@/types/auth';

export const AuthService = {
  async login(payload: SendOtpRQ): Promise<SendOtpRS> {
    const res = await ApiService.fetchData<SendOtpRQ, SendOtpRS>({
      url: '/auth/login',
      method: 'POST',
      data: payload,
    });
    return res.data;
  },
  async verify(payload: VerifyOtpRQ): Promise<VerifyOtpRS> {
    const res = await ApiService.fetchData<VerifyOtpRQ, VerifyOtpRS>({
      url: '/auth/verify',
      method: 'POST',
      data: payload,
    });
    return res.data;
  },
};
