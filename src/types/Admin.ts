import type { BaseResponse } from '@/types/global/base-response';

export type Admin = {
  id: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  nickname?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type GetAllAdminsRS = BaseResponse<Admin[]>;
