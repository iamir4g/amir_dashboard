import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  readData: vi.fn(),
}));

import { readData } from '@/core/http-service';
import { getBookInspectionByDateMap } from './getBookinspectionByDate';

describe('getBookInspectionByDateMap', () => {
  it('builds /booking-inspection/by-date query and returns normalized map', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: {
        '1405-03-17': [{ id: 10, status: 'PENDING' }],
        '1405-03-18': [],
      },
      error: {},
      meta: {},
    });

    const result = await getBookInspectionByDateMap({
      from: '2026-06-01',
      to: '2026-06-07',
      status: 'PENDING',
      garage_id: 5,
      order: 'created_at desc',
      is_admin: true,
      code: '800838',
      phone: '0912',
    });

    expect(Object.keys(result)).toEqual(['1405-03-17', '1405-03-18']);
    expect(result['1405-03-17']).toHaveLength(1);
    expect(result['1405-03-17']?.[0]?.id).toBe(10);

    const calledUrl = (readData as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0] as string;
    const query = calledUrl.split('?')[1] ?? '';
    const params = new URLSearchParams(query);

    expect(calledUrl.startsWith('/booking-inspection/by-date?')).toBe(true);
    expect(params.get('from')).toBe('2026-06-01');
    expect(params.get('to')).toBe('2026-06-07');
    expect(params.get('status')).toBe('PENDING');
    expect(params.get('garage_id')).toBe('5');
    expect(params.get('order')).toBe('created_at desc');
    expect(params.get('is_admin')).toBe('true');
    expect(params.get('code')).toBe('800838');
    expect(params.get('phone')).toBe('0912');
  });
});
