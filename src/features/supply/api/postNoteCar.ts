import { createData } from '@/core/http-service';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import type { Note } from '@/types/Cars';

export type PostNoteCarBody = {
  admin_id: number;
  car_v2_id: number;
  text: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNote = (value: unknown): value is Note => {
  if (!isObject(value)) return false;
  return 'id' in value && 'text' in value && 'car_v2_id' in value;
};

const normalizeCreateNoteResponse = (raw: unknown): Note => {
  if (isNote(raw)) return raw;

  if (isObject(raw)) {
    const data = (raw as Record<string, unknown>).data;
    if (isNote(data)) return data;

    if (isObject(data)) {
      const nested = (data as Record<string, unknown>).data;
      if (isNote(nested)) return nested;
    }
  }

  return raw as Note;
};

export const postNoteCar = async (data: PostNoteCarBody): Promise<Note> => {
  const url = `/notes`;
  const raw = await createData<PostNoteCarBody, unknown>(url, data, undefined, false);
  return normalizeCreateNoteResponse(raw);
};

export const usePostNoteCarMutation = (): UseMutationResult<Note, Error, PostNoteCarBody> => {
  return useMutation({
    mutationKey: ['notes', 'create'],
    mutationFn: postNoteCar,
  });
};
