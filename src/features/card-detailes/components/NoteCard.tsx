import React, { useMemo } from 'react';
import { Card, Group, Text } from '@mantine/core';
import type { Note } from '@/types/Cars';

type NoteCardProps = {
  note: Note;
};

export default function NoteCard({ note }: NoteCardProps) {
  const authorName = useMemo(() => {
    const firstName = note.admin?.first_name ?? '';
    const lastName = note.admin?.last_name ?? '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || '---';
  }, [note.admin?.first_name, note.admin?.last_name]);

  const createdAtLabel = useMemo(() => {
    const value = note.created_at;
    if (!value) return '';
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return '';
    return date.toLocaleString('fa-IR-u-ca-persian');
  }, [note.created_at]);

  return (
    <Card withBorder radius='md' p='sm'>
      <Group justify='space-between' align='center' mb={6} wrap='nowrap'>
        <Text size='xs' c='dimmed'>
          {createdAtLabel}
        </Text>
        <Text size='xs' fw={600}>
          {authorName}
        </Text>
      </Group>
      <Text size='sm'>{note.text}</Text>
    </Card>
  );
}

