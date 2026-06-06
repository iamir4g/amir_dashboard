import type { BaseResponse } from '@/types/global/base-response';

export type CarOperator = {
  id: number;
  car_v2_id: number;
  sale_expert?: number;
  supply_expert?: number;
  technical_expert?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type CreateCarOperatorRQ = {
  car_v2_id: number;
  supply_expert?: number;
  technical_expert: number;
};

export type CreateCarOperatorRS = BaseResponse<CarOperator>;
