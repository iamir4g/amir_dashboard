import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  patchData: vi.fn(),
}));

import { patchData } from '@/core/http-service';
import { patchCar } from './patchCar';

describe('patchCar', () => {
  it('calls PATCH /cars/{id} with minimal body', async () => {
    (patchData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

    await patchCar({ id: 123, body: { admin_id: 7, status: 'ADMIN_APPROVED' } });

    expect(patchData).toHaveBeenCalledWith('/cars/123', { admin_id: 7, status: 'ADMIN_APPROVED' }, undefined, false);
  });
});

