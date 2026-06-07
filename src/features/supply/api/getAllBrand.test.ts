import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  readData: vi.fn(),
}));

import { readData } from '@/core/http-service';
import { getAllBrands } from './getAllBrand';

describe('getAllBrands', () => {
  it('builds /brands query and returns normalized list', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [{ id: 15, name_fa: 'پراید' }],
      error: {},
      meta: { total_items: 1 },
    });

    const result = await getAllBrands({ page: 1, page_size: 10, status: 'ENABLE', order: 'id desc' });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(15);

    const calledUrl = (readData as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as string;
    const query = calledUrl.split('?')[1] ?? '';
    const params = new URLSearchParams(query);

    expect(calledUrl.startsWith('/brands?')).toBe(true);
    expect(params.get('page')).toBe('1');
    expect(params.get('page_size')).toBe('10');
    expect(params.get('status')).toBe('ENABLE');
    expect(params.get('order')).toBe('id desc');
  });
});

