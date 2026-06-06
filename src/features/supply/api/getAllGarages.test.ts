import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  readData: vi.fn(),
}));

import { readData } from '@/core/http-service';
import { getAllGarages } from './getAllGarages';

describe('getAllGarages', () => {
  it('returns garages list when api returns array', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { id: 1, name: 'G1' },
      { id: 2, name: 'G2' },
    ]);

    const result = await getAllGarages();
    expect(result).toHaveLength(2);
    expect((readData as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]).toBe('/garages');
  });

  it('normalizes response when api wraps list in {data}', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [{ id: 3, name: 'G3' }],
      error: {},
      meta: {},
    });

    const result = await getAllGarages();
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(3);
  });
});

