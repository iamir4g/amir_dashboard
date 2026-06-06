import { ActionIcon, Group, SimpleGrid, Text, UnstyledButton } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { toPersianDigits } from '@/utils/digits';

type JalaliCalendarProps = {
  value: string | null;
  onChange: (value: string) => void;
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const parseJalaliYmd = (value: string): { y: number; m: number; d: number } | null => {
  const parts = value.split('-');
  if (parts.length !== 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  return { y, m, d };
};

const toJalaliYmd = (gregoryYmd: string): { y: number; m: number; d: number } | null => {
  const g = dayjs(gregoryYmd);
  if (!g.isValid()) return null;
  const jalali = (g as any).calendar('jalali').format('YYYY-MM-DD') as string;
  return parseJalaliYmd(jalali);
};

const toGregoryYmd = (jalaliYmd: string): string | null => {
  const j = (dayjs as any)(jalaliYmd, { jalali: true });
  if (!j?.isValid?.()) return null;
  return (j as any).calendar('gregory').format('YYYY-MM-DD') as string;
};

const monthNames = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export default function JalaliCalendar({ value, onChange }: JalaliCalendarProps) {
  const initial = useMemo(() => {
    if (!value) {
      const nowJ = ((dayjs() as any).calendar('jalali').format('YYYY-MM-DD') as string) ?? '';
      return parseJalaliYmd(nowJ);
    }
    return toJalaliYmd(value);
  }, [value]);

  const [currentYear, setCurrentYear] = useState<number>(() => initial?.y ?? 1400);
  const [currentMonth, setCurrentMonth] = useState<number>(() => initial?.m ?? 1);

  const selectedJalali = useMemo(() => (value ? toJalaliYmd(value) : null), [value]);

  const calendarDays = useMemo(() => {
    const firstJalali = `${currentYear}-${pad2(currentMonth)}-01`;
    const first = (dayjs as any)(firstJalali, { jalali: true });
    const daysInMonth = first.daysInMonth() as number;
    const firstWeekday = (first.day() as number) ?? 0;
    const weekStart = 6;
    const leading = (firstWeekday - weekStart + 7) % 7;

    const cells: Array<
      | { type: 'empty' }
      | { type: 'day'; jalaliYmd: string; day: number; gregoryYmd: string; isSelected: boolean }
    > = [];

    for (let i = 0; i < leading; i += 1) cells.push({ type: 'empty' });

    for (let d = 1; d <= daysInMonth; d += 1) {
      const jYmd = `${currentYear}-${pad2(currentMonth)}-${pad2(d)}`;
      const gYmd = toGregoryYmd(jYmd);
      if (!gYmd) continue;
      const isSelected =
        selectedJalali?.y === currentYear && selectedJalali?.m === currentMonth && selectedJalali?.d === d;
      cells.push({ type: 'day', jalaliYmd: jYmd, day: d, gregoryYmd: gYmd, isSelected });
    }

    const remainder = cells.length % 7;
    const trailing = remainder === 0 ? 0 : 7 - remainder;
    for (let i = 0; i < trailing; i += 1) cells.push({ type: 'empty' });

    return cells;
  }, [currentMonth, currentYear, selectedJalali?.d, selectedJalali?.m, selectedJalali?.y]);

  const goPrevMonth = () => {
    setCurrentMonth((m) => {
      if (m > 1) return m - 1;
      setCurrentYear((y) => y - 1);
      return 12;
    });
  };

  const goNextMonth = () => {
    setCurrentMonth((m) => {
      if (m < 12) return m + 1;
      setCurrentYear((y) => y + 1);
      return 1;
    });
  };

  const headerLabel = `${monthNames[currentMonth - 1] ?? ''} ${toPersianDigits(String(currentYear))}`;

  return (
    <div>
      <Group justify='space-between' mb='xs'>
        <ActionIcon variant='subtle' onClick={goPrevMonth}>
          <IconChevronRight size={16} />
        </ActionIcon>
        <Text fw={600}>{headerLabel}</Text>
        <ActionIcon variant='subtle' onClick={goNextMonth}>
          <IconChevronLeft size={16} />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={7} spacing={4} verticalSpacing={4}>
        {weekDays.map((w) => (
          <Text key={w} size='xs' c='dimmed' ta='center'>
            {w}
          </Text>
        ))}

        {calendarDays.map((cell, idx) =>
          cell.type === 'empty' ? (
            <div key={`e-${idx}`} />
          ) : (
            <UnstyledButton
              key={cell.jalaliYmd}
              onClick={() => onChange(cell.gregoryYmd)}
              style={{
                height: 34,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: cell.isSelected ? 'var(--mantine-color-blue-6)' : undefined,
                color: cell.isSelected ? 'white' : undefined,
              }}
            >
              <Text size='sm'>{toPersianDigits(String(cell.day))}</Text>
            </UnstyledButton>
          )
        )}
      </SimpleGrid>
    </div>
  );
}
