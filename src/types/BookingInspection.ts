import type { BaseResponse } from '@/types/global/base-response';
import type { Garage, GarageLink } from '@/types/Garage';
import type { CarValue } from '@/types/Cars';

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
  user_id: number;
};

export type CreateBookingInspectionRS = BaseResponse<BookingInspection>;

export type BookingInspectionByDateInventory = {
  consumer_id: number;
  created_at: string;
  date: string;
  deleted_at: string | null;
  end_time: string;
  garage_id: number;
  id: number;
  reserved_at: string;
  status: string;
  updated_at: string;
  start_time: string;
};

export type BookingInspectionByDateUserMeta = {
  metrix_user_id: string;
  badges: string[];
  [key: string]: unknown;
};

export type BookingInspectionByDateUser = {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  first_name: string;
  last_name: string;
  nickname: string;
  email: string | null;
  password?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: string;
  rating: number;
  type: string;
  fcm_token: string;
  kyc: boolean;
  meta: BookingInspectionByDateUserMeta;
};

export type BookingInspectionByDateGarage = Omit<Garage, 'links'> & { links: GarageLink[] | null };

export type BookingInspectionByDateItem = {
  id: number;
  inventory_id: number;
  car_id: number;
  post_id: number;
  car_submission_id: number;
  user_id: number;
  admin_id: number;
  description: string;
  status: string;
  confirmation_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  garage_inventory: BookingInspectionByDateInventory;
  user: BookingInspectionByDateUser | null;
  garage: BookingInspectionByDateGarage | null;
  car: CarValue | null;
};

export type BookingInspectionByDateMap = Record<string, BookingInspectionByDateItem[]>;

export type GetBookInspectionByDateRS = BaseResponse<BookingInspectionByDateMap>;

export type GetBookInspectionByDateQueryParams = {
  from?: string;
  to?: string;
  status?: string;
  garage_id?: number;
  order?: string;
  is_admin?: boolean;
  code?: string;
  phone?: string;
};
