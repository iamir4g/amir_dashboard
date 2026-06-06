import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  readData: vi.fn(),
}));

import { readData } from '@/core/http-service';
import { getAllAdmins } from './getAllAdmins';

describe('getAllAdmins', () => {
  it('returns admins list when api returns array', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { id: 1, first_name: 'A' },
      { id: 2, first_name: 'B' },
    ]);

    const result = await getAllAdmins();
    expect(result).toHaveLength(2);
    expect((readData as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]).toBe('/admins');
  });

  it('normalizes response when api wraps list in {data}', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [{ id: 3, first_name: 'C' }],
      error: {},
      meta: {},
    });

    const result = await getAllAdmins();
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(3);
  });
});
