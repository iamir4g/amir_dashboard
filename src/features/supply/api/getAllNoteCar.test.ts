import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/http-service', () => ({
  readData: vi.fn(),
}));

import { readData } from '@/core/http-service';
import { getAllNoteCar } from './getAllNoteCar';

describe('getAllNoteCar', () => {
  it('builds /notes query and returns normalized list', async () => {
    (readData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [
        {
          id: 10,
          admin_id: 407,
          car_v2_id: 4410,
          text: 'hello',
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
          deleted_at: null,
        },
      ],
    });

    const result = await getAllNoteCar({
      page: 2,
      page_size: 10,
      order: 'created_at desc',
      ids: [1, 2],
      car_v2_id: 4410,
      admin_id: 407,
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(10);

    const calledUrl = (readData as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as string;
    const query = calledUrl.split('?')[1] ?? '';
    const params = new URLSearchParams(query);

    expect(calledUrl.startsWith('/notes?')).toBe(true);
    expect(params.get('page')).toBe('2');
    expect(params.get('page_size')).toBe('10');
    expect(params.get('order')).toBe('created_at desc');
    expect(params.get('car_v2_id')).toBe('4410');
    expect(params.get('admin_id')).toBe('407');
    expect(params.getAll('ids')).toEqual(['1', '2']);
  });
});

