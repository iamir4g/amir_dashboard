import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  readData: vi.fn(),
}));

import { readData } from '@/core/http-service';
import { getAllModels } from './getAllModels';

describe('getAllModels', () => {
  it('requires brand_id, builds /models query and returns normalized list', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [{ id: 47, brand_id: 15, name_fa: 'صندوق دار' }],
      error: {},
      meta: { total_items: 1 },
    });

    const result = await getAllModels({ brand_id: 15, page: 1, page_size: 10, status: 'ENABLE' });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(47);
    expect(result[0]?.brand_id).toBe(15);

    const calledUrl = (readData as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as string;
    const query = calledUrl.split('?')[1] ?? '';
    const params = new URLSearchParams(query);

    expect(calledUrl.startsWith('/models?')).toBe(true);
    expect(params.get('brand_id')).toBe('15');
    expect(params.get('page')).toBe('1');
    expect(params.get('page_size')).toBe('10');
    expect(params.get('status')).toBe('ENABLE');
  });
});

