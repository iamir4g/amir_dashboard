import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  createData: vi.fn(),
}));

import { createData } from '@/core/http-service';
import { postBookInspection } from './postBook-inspection';

describe('postBookInspection', () => {
  it('posts to /booking-inspection with expected body and normalizes {data}', async () => {
    (createData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { id: 10, status: 'WAITING' },
      error: {},
      meta: {},
    });

    const result = await postBookInspection({
      status: 'WAITING',
      admin_id: 1,
      car_id: 2,
      car_v2_id: 2,
      garage_id: 3,
      date: '2026-06-06',
      start_time: '10:00',
      end_time: '10:30',
    });

    expect(result.id).toBe(10);
    expect(createData).toHaveBeenCalledWith(
      '/booking-inspection',
      expect.objectContaining({ status: 'WAITING', car_id: 2, garage_id: 3 }),
      undefined,
      false
    );
  });
});

