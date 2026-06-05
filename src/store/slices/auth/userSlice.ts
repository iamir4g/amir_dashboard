export interface UserState {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  nickname?: string;
  type?: string;
  isDepositVerified?: boolean;
  isDepositLocked?: boolean;
  status?: string;
  kyc?: boolean;

  role?: string[];

  is_deposit_verified?: false;
  is_deposit_locked?: false;
}

export const initialUserState: UserState = {
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
};
