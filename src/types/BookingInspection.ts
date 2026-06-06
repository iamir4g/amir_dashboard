import type { BaseResponse } from '@/types/global/base-response';
import type { Garage } from '@/types/Garage';

export type InspectionInventory = {
  consumer_id: number;
  created_at: string;
  date: string;
  deleted_at: string | null;
  end_time: string;
  garage_id: number;
  id: number;
  reserved_at: string;
  start_time: string;
  status: string;
  updated_at: string;
};

export type BookingInspection = {
  admin_id: number;
  car_id: number;
  car_submission_id: number;
  car_v2_id: number;
  confirmation_code: string;
  created_at: string;
  deleted_at: string | null;
  description: string;
  garage: Garage;
  id: number;
  inventory: InspectionInventory;
  inventory_id: number;
  post_id: number;
  status: string;
  updated_at: string;
  user_id: number;
};

export type GetBookInspectionRS = BaseResponse<BookingInspection[]>;

export type GetBookInspectionQueryParams = {
  page?: number;
  page_size?: number;
  car_id?: number;
  garage_id?: number;
  status?: string;
  user_id?: number;
  admin_id?: number;
  order?: string;
  phone?: string;
  code?: string;
};

export type CreateBookingInspectionRQ = {
  admin_id?: number;
  car_id?: number;
  car_submission_id?: number;
  car_v2_id?: number;
  date?: string;
  description?: string;
  end_time?: string;
  garage_id?: number;
  post_id?: number;
  start_time?: string;
  status: string;
  user_id?: number;
};

export type CreateBookingInspectionRS = BaseResponse<BookingInspection>;
