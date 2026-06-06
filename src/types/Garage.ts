import type { BaseResponse } from '@/types/global/base-response';

export type GarageLink = {
  name: string;
  url: string;
};

export type Garage = {
  address: string;
  capacity: number;
  channel: string;
  created_at: string;
  deleted_at: string | null;
  description: string;
  id: number;
  image_map: string;
  latitude: string;
  links: GarageLink[];
  longitude: string;
  name: string;
  phone: string;
  priority: number;
  status: string;
  updated_at: string;
};

export type GetAllGaragesRS = BaseResponse<Garage[]>;

