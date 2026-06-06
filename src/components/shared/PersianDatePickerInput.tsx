import { useMemo, useState } from 'react';
import { Popover, TextInput } from '@mantine/core';
import JalaliCalendar from '@/components/shared/JalaliCalendar';

type PersianDatePickerInputProps = {
  label?: string;
  placeholder?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
};

export default function PersianDatePickerInput({
  label,
  placeholder,
  value,
  onChange,
  disabled,
}: PersianDatePickerInputProps) {
  const [opened, setOpened] = useState(false);

  const formatPersianDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return (val: string | null) => {
      if (!val) return '';
      const date = new Date(`${val}T00:00:00Z`);
      if (!Number.isFinite(date.getTime())) return '';
      return formatter.format(date);
    };
  }, []);

  return (
    <Popover opened={opened} onChange={setOpened} position='bottom-start' withArrow>
      <Popover.Target>
        <TextInput
          label={label}
          placeholder={placeholder}
          readOnly
          value={formatPersianDate(value)}
          onClick={() => {
            if (disabled) return;
            setOpened(true);
          }}
          disabled={disabled}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <JalaliCalendar
          value={value}
          onChange={(next) => {
            onChange(next);
            setOpened(false);
          }}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
