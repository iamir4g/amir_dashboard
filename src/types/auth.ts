import { BaseResponse } from './global/base-response';

export type SignInCredential = {
  phone: string;
};

export type SendOtpRQ = {
  phone: string;
  meta?: OTPMeta;
};

export type SendOtp = {
  is_registered?: boolean;
  token?: string;
};
export type SendOtpRS = BaseResponse<SendOtp>;

export type VerifyOtpRQ = {
  code: string;
  token: string;
  fcm_token?: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  meta?: UserMeta;
};

export type VerifyOtp = {
  access_token?: string;
  refresh_token?: string;
  user_info?: UserInfo;
};
export type VerifyOtpRS = BaseResponse<VerifyOtp>;

export type OTPMeta = {
  token?: string;
};

export type UserMeta = {
  [key: string]: unknown;
};

export type UserInfo = {
  first_name?: string;
  id?: number;
  is_deposit_locked?: boolean;
  is_deposit_verified?: boolean;
  kyc?: boolean;
  last_name?: string;
  nickname?: string;
  phone?: string;
  status?: string;
  type?: string;
  role?: string[];
};

export type AuthStorageData = {
  access_token: string;
  refresh_token: string;
  user_info: UserInfo;
};

export interface ResponseInfoObject {
  status: 'success' | 'failed';
  error_code?: number;
  message?: string;
}

export type SignUpCredential = {
  name: string;
  username: string;
  password: string;
};
