import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  readData: vi.fn(),
}));

import { readData } from '@/core/http-service';
import { getBookInspectionList } from './getBookInspection';

describe('getBookInspectionList', () => {
  it('builds /booking-inspection query and returns normalized list', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [{ id: 10, status: 'WAITING' }],
      error: {},
      meta: {},
    });

    const result = await getBookInspectionList({
      page: 2,
      page_size: 10,
      car_id: 1,
      garage_id: 2,
      status: 'WAITING',
      user_id: 3,
      admin_id: 4,
      order: 'created_at desc',
      phone: '0912',
      code: 'CAR-1',
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(10);

    const calledUrl = (readData as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as string;
    const query = calledUrl.split('?')[1] ?? '';
    const params = new URLSearchParams(query);

    expect(calledUrl.startsWith('/booking-inspection?')).toBe(true);
    expect(params.get('page')).toBe('2');
    expect(params.get('page_size')).toBe('10');
    expect(params.get('car_id')).toBe('1');
    expect(params.get('garage_id')).toBe('2');
    expect(params.get('status')).toBe('WAITING');
    expect(params.get('user_id')).toBe('3');
    expect(params.get('admin_id')).toBe('4');
    expect(params.get('order')).toBe('created_at desc');
    expect(params.get('phone')).toBe('0912');
    expect(params.get('code')).toBe('CAR-1');
  });
});

