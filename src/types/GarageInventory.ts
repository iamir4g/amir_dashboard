import type { BaseResponse } from '@/types/global/base-response';

export type GarageInventory = {
  consumer_id: number | null;
  created_at: string;
  date: string;
  deleted_at: string | null;
  end_time: string;
  garage_id: number;
  id: number;
  reserved_at: string | null;
  start_time: string;
  status: string;
  updated_at: string;
};

export type GetGarageInventoriesRS = BaseResponse<GarageInventory[]>;

export type GetGarageInventoriesQueryParams = {
  page?: number;
  page_size?: number;
  garage_id?: number;
  date?: string;
  order?: string;
};
