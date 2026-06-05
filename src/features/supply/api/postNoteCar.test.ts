import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  createData: vi.fn(),
}));

import { createData } from '@/core/http-service';
import { postNoteCar } from './postNoteCar';

describe('postNoteCar', () => {
  it('posts to /notes with expected body (plain note response)', async () => {
    (createData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: 11,
      admin_id: 407,
      car_v2_id: 4410,
      text: 'new note',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      deleted_at: null,
    });

    const result = await postNoteCar({ admin_id: 407, car_v2_id: 4410, text: 'new note' });

    expect(result.id).toBe(11);
    expect(createData).toHaveBeenCalledTimes(1);
    expect(createData).toHaveBeenCalledWith(
      '/notes',
      { admin_id: 407, car_v2_id: 4410, text: 'new note' },
      undefined,
      false
    );
  });

  it('normalizes response when server wraps note in {data}', async () => {
    (createData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: {
        id: 12,
        admin_id: 407,
        car_v2_id: 4410,
        text: 'wrapped',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
        deleted_at: null,
      },
    });

    const result = await postNoteCar({ admin_id: 407, car_v2_id: 4410, text: 'wrapped' });
    expect(result.id).toBe(12);
    expect(result.text).toBe('wrapped');
  });
});
