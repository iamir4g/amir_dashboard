import { setUser, signInSuccess, signOutSuccess, useAppSelector, setUserId } from '@/store';
import appConfig from '@/configs/app.config';
import {
  AUTH_DATA_STORAGE_KEY,
  AUTH_OTP_TOKEN_STORAGE_KEY,
  REDIRECT_URL_KEY,
} from '@/constants/app.constant';
import { useNavigate } from 'react-router-dom';
import type { AuthStorageData, SignInCredential } from '@/types/auth';
import useQuery from '@/utils/hooks/useQuery';
import { usePostLoginMutation } from '@/features/auth/api/login';
import { useSignOutMutation } from '@/features/auth/api/signOut';
import { useVerifyOtpMutation } from '@/features/auth/api/verifyOtp';

type Status = 'success' | 'failed';

function useAuth() {
  const navigate = useNavigate();
  const signInMutation = usePostLoginMutation();
  const signOutMutation = useSignOutMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const { token, signedIn } = useAppSelector((state) => state.auth.session);
  // const userId = useAppSelector((state) => state.auth.userInfo.userId);
  const query = useQuery();

  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: Status;
        message: string;
      }
    | undefined
  > => {
    try {
      const resp = await signInMutation.mutateAsync(values);
      if (!resp.data.is_registered) {
        return {
          status: 'failed',
          message: 'کاربر یافت نشد',
        };
      }

      if (!resp.data.token) {
        return {
          status: 'failed',
          message: 'خطا در دریافت توکن',
        };
      }

      localStorage.setItem(AUTH_OTP_TOKEN_STORAGE_KEY, resp.data.token);
      const redirectUrl = query.get(REDIRECT_URL_KEY);
      navigate(
        `/verify-otp${redirectUrl ? `?${REDIRECT_URL_KEY}=${encodeURIComponent(redirectUrl)}` : ''}`
      );
      return {
        status: 'success',
        message: '',
      };
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.description || errors.toString(),
      };
    }
  };

  const verifyOtp = async (
    code: string
  ): Promise<
    | {
        status: Status;
        message: string;
      }
    | undefined
  > => {
    const otpToken = localStorage.getItem(AUTH_OTP_TOKEN_STORAGE_KEY);
    if (!otpToken) {
      return {
        status: 'failed',
        message: 'توکن ورود یافت نشد. دوباره شماره همراه را وارد کنید.',
      };
    }

    try {
      const resp = await verifyOtpMutation.mutateAsync({ code, token: otpToken });

      if (!resp.data.access_token || !resp.data.refresh_token) {
        return {
          status: 'failed',
          message: 'پاسخ سرور ناقص است',
        };
      }

      const userInfo = resp.data.user_info ?? resp.data.admin_info ?? {};
      const isDepositVerified = userInfo.is_deposit_verified ?? true;

      const authData: AuthStorageData = {
        access_token: resp.data.access_token,
        refresh_token: resp.data.refresh_token,
        user_info: userInfo,
      };

      localStorage.setItem(AUTH_DATA_STORAGE_KEY, JSON.stringify(authData));
      localStorage.removeItem(AUTH_OTP_TOKEN_STORAGE_KEY);

      signInSuccess({
        token: resp.data.access_token,
        refreshToken: resp.data.refresh_token,
        expireTime: 0,
      });

      if (userInfo.id !== undefined) {
        setUserId(String(userInfo.id));
      }

      setUser({
        id: userInfo.id ?? 0,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        phone: userInfo.phone ?? '',
        nickname: userInfo.nickname,
        type: userInfo.type,
        isDepositVerified,
        isDepositLocked: userInfo.is_deposit_locked ?? false,
        status: userInfo.status,
        kyc: userInfo.kyc ?? false,
        role: userInfo.role ?? [],
      });

      const redirectUrl = query.get(REDIRECT_URL_KEY);
      navigate(
        isDepositVerified
          ? redirectUrl || appConfig.authenticatedEntryPath
          : `/kyc${redirectUrl ? `?${REDIRECT_URL_KEY}=${encodeURIComponent(redirectUrl)}` : ''}`
      );
      return {
        status: 'success',
        message: '',
      };
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.description || errors.toString(),
      };
    }
  };

  const handleSignOut = () => {
    signOutSuccess();
    localStorage.removeItem(AUTH_DATA_STORAGE_KEY);
    localStorage.removeItem(AUTH_OTP_TOKEN_STORAGE_KEY);

    setUser({
      id: 0,
      firstName: '',
      lastName: '',
      phone: '',
      nickname: '',
      type: '',
      isDepositVerified: false,
      isDepositLocked: false,
      status: '',
      kyc: false,
      role: [],
    });
    navigate(appConfig.unAuthenticatedEntryPath);
  };

  const signOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } finally {
      handleSignOut();
    }
  };

  return {
    authenticated: token && signedIn,
    signIn,
    verifyOtp,
    signOut,
  };
}

export { useAuth };
export default useAuth;
