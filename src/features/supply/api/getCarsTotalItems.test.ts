import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  readData: vi.fn(),
}));

import { readData } from '@/core/http-service';
import { getCarsTotalItems } from './getCars';
import { WAITING } from '@/constants/Car.status';

describe('getCarsTotalItems', () => {
  it('returns meta.total_items and builds /cars query', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [],
      error: {},
      meta: { total_items: 10, page: 1, size: 1, total_pages: 10 },
    });

    const total = await getCarsTotalItems({ status: WAITING, page: 1, page_size: 1 });

    expect(total).toBe(10);

    const calledUrl = (readData as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as string;
    const query = calledUrl.split('?')[1] ?? '';
    const params = new URLSearchParams(query);

    expect(calledUrl.startsWith('/cars?')).toBe(true);
    expect(params.get('status')).toBe(WAITING);
    expect(params.get('page')).toBe('1');
    expect(params.get('page_size')).toBe('1');
  });
});

