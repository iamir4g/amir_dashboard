import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  createData: vi.fn(),
}));

import { createData } from '@/core/http-service';
import { postOperators } from './postOperators';

describe('postOperators', () => {
  it('posts to /operators with expected body and normalizes {data}', async () => {
    (createData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { id: 1, car_v2_id: 10, supply_expert: 2, technical_expert: 3 },
      error: {},
      meta: {},
    });

    const result = await postOperators({ car_v2_id: 10, supply_expert: 2, technical_expert: 3 });

    expect(result.id).toBe(1);
    expect(createData).toHaveBeenCalledWith(
      '/operators',
      expect.objectContaining({ car_v2_id: 10, supply_expert: 2, technical_expert: 3 }),
      undefined,
      false
    );
  });
});
