import { CarsStatus } from '@/constants/Car.status';
import { BaseResponse } from './global/base-response';
import type { Admin } from '@/types/Admin';

export interface GetCarsQueryParams {
  page?: number;
  page_size?: number;
  garage_id?: string;
  user_id?: string;
  car_submission_id?: string;
  ids?: string;
  status?: CarsStatus;
  type?: 'STATIC' | 'DEFAULT' | string;
  code?: string;
  inbound_type?: string;
  order?: string;
  channel?: string;
  phone?: string;
  from_date?: string;
  to_date?: string;
}

export type CarResponse = BaseResponse<CarValue>;
export interface CarValue {
  admin_id?: number | null;
  attribute_values?: AttributeValue[] | null;
  audits?: Audit[] | null;
  badges?: string[] | null;
  body_condition?: BodyCondition[] | null;
  brand?: Brand;
  brand_id?: number;
  channel?: string;
  city?: City;
  city_id?: number;
  code?: string;
  color?: string;
  created_at?: string;
  deleted_at?: string | null;
  description?: string;
  feature_attributes?: FeatureAttribute[] | null;
  gallery?: GalleryItem[] | null;
  garage?: Garage | null;
  id?: number;
  inbound_type?: string;
  is_collectible?: boolean;
  is_divar?: boolean;
  labels?: Label[] | null;
  lead_score?: number;
  make_year?: number;
  method?: string;
  mileage?: number;
  model?: CarModel;
  model_id?: number;
  name?: string;
  notes?: Note[] | null;
  price_record?: PriceRecord | null;
  reject_reason?: string;
  sell_type?: string;
  showed_up_at?: string | null;
  status?: string;
  step?: string;
  trim?: Trim | null;
  trim_id?: number | null;
  type?: string;
  updated_at?: string;
  user?: User | null;
  user_id?: number;
  vin?: string;
}

// ---- زیرمجموعه‌های ساختار ماشین (Sub-Interfaces) ----

interface AttributeValue {
  attribute_key_id: number;
  car_id: number;
  car_v2_id: number;
  created_at: string;
  deleted_at: string | null;
  description: string;
  id: number;
  is_show: boolean;
  trim_make_year_id: number;
  updated_at: string;
  value: string;
}

interface Audit {
  audit_type: string;
  car: {
    admin_id: number;
    brand_id: number;
    channel: string;
    city_id: number;
    code: string;
    color: string;
    created_at: string;
    deleted_at: string | null;
    description: string;
    garage_id: number;
    id: number;
    is_collectible: boolean;
    labels: Label[];
    lead_score: number;
    make_year: number;
    mileage: number;
    model_id: number;
    name: string;
    post_token: string;
    sell_type: string;
    status: string;
    step: string;
    submission_meta: {
      query_params: string;
      referrer: string;
    };
    submission_method: string;
    trim_id: number;
    type: string;
    updated_at: string;
    user_id: number;
    vin: string;
  };
  created_at: string;
  deleted_at: string | null;
  id: number;
  meta: {
    admin_id: number;
    message: string;
    title: string;
  };
  reason: string;
  source_column: string;
  source_id: number;
  updated_at: string;
  value_after: string;
  value_before: string;
}

interface BodyCondition {
  car_submission_id: number;
  car_v2_id: number;
  id: number;
  key_en: string;
  key_fa: string;
  value: boolean;
}

export interface Brand {
  created_at: string;
  deleted_at: string | null;
  description: string;
  id: number;
  keywords: string[];
  logo: string;
  name_en: string;
  name_fa: string;
  priority: number;
  status: string;
  updated_at: string;
}

interface City {
  created_at: string;
  id: number;
  name: string;
  province_id: number;
  slug: string;
  status: string;
  updated_at: string;
}

interface FeatureAttribute {
  key: string;
  value: string;
}

interface GalleryItem {
  car_id: number;
  car_v2_id: number;
  created_at: string;
  deleted_at: string | null;
  description: string;
  group_gallery_id: number;
  id: number;
  is_primary: boolean;
  name: string;
  priority: number;
  status: string;
  thumb_name: string;
  title: string;
  type: string;
  updated_at: string;
  video_url: string;
}

interface LinkItem {
  name: string;
  url: string;
}

interface Garage {
  address: string;
  capacity: number;
  channel: string;
  created_at: string;
  deleted_at: string | null;
  description: string;
  id: number;
  image_map: string;
  latitude: string;
  links: LinkItem[];
  longitude: string;
  name: string;
  phone: string;
  priority: number;
  status: string;
  updated_at: string;
}

interface Label {
  color: string;
  created_at: string;
  id: number;
  name: string;
  status: string;
  updated_at: string;
}

export interface CarModel {
  brand_id: number;
  created_at: string;
  deleted_at: string | null;
  description: string;
  id: number;
  keywords: string[];
  name_en: string;
  name_fa: string;
  priority: number;
  status: string;
  updated_at: string;
}

export interface Note {
  admin_id: number | null;
  admin?: Admin | null;
  car_v2_id: number;
  created_at: string;
  deleted_at: string | null;
  id: number;
  text: string;
  updated_at: string;
}

interface PriceRecord {
  car_id: number;
  created_at: string;
  deleted_at: string | null;
  estimated: string;
  estimated_in_market: string;
  final: string;
  final_customer: string;
  id: number;
  kh_suggest_for_buy: string;
  kh_suggest_for_sell: string;
  lower_suggest: string;
  revenue: string;
  sales_person_lower: string;
  sales_person_upper: string;
  updated_at: string;
  upper_suggest: string;
  user_suggest: string;
}

interface Trim {
  created_at: string;
  deleted_at: string | null;
  description: string;
  id: number;
  keywords: string[];
  model_id: number;
  name_en: string;
  name_fa: string;
  updated_at: string;
}

interface User {
  address: string;
  city: string;
  created_at: string;
  deleted_at: string | null;
  email: string | null;
  fcm_token: string;
  first_name: string;
  id: number;
  kyc: boolean;
  last_name: string;
  meta: {
    badges: string[];
    metrix_user_id: string;
  };
  nickname: string;
  password?: string;
  phone: string;
  rating: number;
  state: string;
  status: string;
  type: string;
  updated_at: string;
  zip: string;
}
