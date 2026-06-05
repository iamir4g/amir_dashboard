import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { GetCarsQueryParams, CarResponse, CarValue } from '@/types/Cars';

// ۱. متد اصلی برای صدا زدن API با استفاده از readData کدهای خودت
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isCarResponse = (value: unknown): value is CarResponse => {
  if (!isObject(value)) return false;
  const data = (value as Record<string, unknown>).data;
  return isObject(data) && 'id' in data;
};

const normalizeCarsListResponse = (raw: unknown): CarValue[] => {
  if (Array.isArray(raw)) {
    if (raw.length > 0 && isCarResponse(raw[0])) {
      return raw.filter(isCarResponse).map((x) => x.data);
    }
    return raw as CarValue[];
  }

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;

    if (Array.isArray(data)) {
      if (data.length > 0 && isCarResponse(data[0])) {
        return (data as unknown[]).filter(isCarResponse).map((x) => x.data);
      }
      return data as CarValue[];
    }

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (Array.isArray(nested)) {
        if (nested.length > 0 && isCarResponse(nested[0])) {
          return (nested as unknown[]).filter(isCarResponse).map((x) => x.data);
        }
        return nested as CarValue[];
      }
    }
  }

  return [];
};

export const getCarsList = async (params?: GetCarsQueryParams): Promise<CarValue[]> => {
  let url = `/cars`;

  // در صورتی که فیلتر یا پارامتری پاس داده شده باشد، آن‌ها را به کوئری استرینگ تبدیل می‌کند
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // فرستادن درخواست بدون skipAuth چون لیست ماشین‌های پنل ادمین توکن می‌خواهد
  const raw = await readData<unknown>(url, undefined, 'Base');
  return normalizeCarsListResponse(raw);
};

// ۲. هوک سفارشی با useQuery برای استفاده در کامپوننت‌های ری‌اکت
export const useGetCarsQuery = (params?: GetCarsQueryParams): UseQueryResult<CarValue[], Error> => {
  return useQuery({
    // قرار دادن params در کلید کوئری تا در صورت تغییر فیلترها، دیتای جدید فچ شود
    queryKey: ['cars', 'list', params],
    queryFn: () => getCarsList(params),
  });
};
