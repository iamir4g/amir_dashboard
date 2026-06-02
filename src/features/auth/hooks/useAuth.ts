import {
  setUser,
  signInSuccess,
  signOutSuccess,
  useAppSelector,
  setUserInfo,
  setUserId,
} from '@/store';
import appConfig from '@/configs/app.config';
import { AUTH_DATA_STORAGE_KEY, AUTH_OTP_TOKEN_STORAGE_KEY, REDIRECT_URL_KEY } from '@/constants/app.constant';
import { useNavigate } from 'react-router-dom';
import type { AuthStorageData, SignInCredential } from '@/types/auth';
import useQuery from '@/utils/hooks/useQuery';
import { useSignInMutation } from '@/features/auth/api/signIn';
import { useSignOutMutation } from '@/features/auth/api/signOut';
import { useVerifyOtpMutation } from '@/features/auth/api/verifyOtp';

type Status = 'success' | 'failed';

function useAuth() {
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();
  const signOutMutation = useSignOutMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const { token, signedIn } = useAppSelector((state) => state.auth.session);
  const userId = useAppSelector((state) => state.auth.userInfo.userId);
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

      if (!resp.is_registered) {
        return {
          status: 'failed',
          message: 'کاربر یافت نشد',
        };
      }

      if (!resp.token) {
        return {
          status: 'failed',
          message: 'خطا در دریافت توکن',
        };
      }

      localStorage.setItem(AUTH_OTP_TOKEN_STORAGE_KEY, resp.token);
      const redirectUrl = query.get(REDIRECT_URL_KEY);
      navigate(`/verify-otp${redirectUrl ? `?${REDIRECT_URL_KEY}=${encodeURIComponent(redirectUrl)}` : ''}`);
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

      if (!resp.access_token || !resp.refresh_token || !resp.user_info) {
        return {
          status: 'failed',
          message: 'پاسخ سرور ناقص است',
        };
      }

      const authData: AuthStorageData = {
        access_token: resp.access_token,
        refresh_token: resp.refresh_token,
        user_info: resp.user_info,
      };

      localStorage.setItem(AUTH_DATA_STORAGE_KEY, JSON.stringify(authData));
      localStorage.removeItem(AUTH_OTP_TOKEN_STORAGE_KEY);

      signInSuccess({
        token: resp.access_token,
        refreshToken: resp.refresh_token,
        expireTime: 0,
      });

      const fullName =
        [resp.user_info.first_name, resp.user_info.last_name].filter(Boolean).join(' ') ||
        resp.user_info.nickname ||
        '';

      if (resp.user_info.id !== undefined) {
        setUserId(String(resp.user_info.id));
      }

      setUser({
        fullName,
        email: '',
        role: [],
        phoneNumber: resp.user_info.phone ?? '',
      });

      const redirectUrl = query.get(REDIRECT_URL_KEY);
      navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
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
    setUserInfo({
      googleLogin: false,
      name: '',
      role: '',
      email: '',
      userId: userId,
    });
    setUser({
      fullName: '',
      role: [],
      email: '',
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

export default useAuth;
