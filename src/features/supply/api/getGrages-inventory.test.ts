import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  readData: vi.fn(),
}));

import { readData } from '@/core/http-service';
import { getGaragesInventoryList } from './getGrages-inventory';

describe('getGaragesInventoryList', () => {
  it('builds /garage-inventories query and returns normalized list', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          date: '2026-06-06T00:00:00Z',
          start_time: '2026-06-06T04:30:00Z',
          end_time: '2026-06-06T06:30:00Z',
          garage_id: 2,
          reserved_at: null,
          consumer_id: null,
          status: 'AVAILABLE',
        },
      ],
      error: {},
      meta: {},
    });

    const result = await getGaragesInventoryList({
      page: 1,
      page_size: 10,
      garage_id: 2,
      date: '2026-06-06',
      order: 'start_time asc',
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(1);

    const calledUrl = (readData as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0] as string;
    const query = calledUrl.split('?')[1] ?? '';
    const params = new URLSearchParams(query);

    expect(calledUrl.startsWith('/garage-inventories?')).toBe(true);
    expect(params.get('page')).toBe('1');
    expect(params.get('page_size')).toBe('10');
    expect(params.get('garage_id')).toBe('2');
    expect(params.get('date')).toBe('2026-06-06');
    expect(params.get('order')).toBe('start_time asc');
  });
});
