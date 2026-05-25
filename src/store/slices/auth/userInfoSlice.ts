export interface UserInfoState {
  email: string;
  userId: string;
  isTwoFaEnabled?: boolean;
  name?: string;
  walletAddress?: string;
  language?: string;
  role: string;
  googleLogin?: boolean;
  notificationCount?: number;
}

export const initialUserInfoState: UserInfoState = {
  email: '',
  userId: '',
  isTwoFaEnabled: false,
  name: '',
  walletAddress: '',
  language: '',
  role: '',
  googleLogin: false,
  notificationCount: 0,
};
