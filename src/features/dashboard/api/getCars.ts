import { readData } from '@/core/http-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { GetCarsQueryParams, CarResponse } from '@/types/Cars';

// ۱. متد اصلی برای صدا زدن API با استفاده از readData کدهای خودت
export const getCarsList = (params?: GetCarsQueryParams): Promise<CarResponse[]> => {
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
  return readData<CarResponse[]>(url, undefined, 'Base');
};

// ۲. هوک سفارشی با useQuery برای استفاده در کامپوننت‌های ری‌اکت
export const useGetCarsQuery = (
  params?: GetCarsQueryParams
): UseQueryResult<CarResponse[], Error> => {
  return useQuery({
    // قرار دادن params در کلید کوئری تا در صورت تغییر فیلترها، دیتای جدید فچ شود
    queryKey: ['cars', 'list', params],
    queryFn: () => getCarsList(params),
  });
};
