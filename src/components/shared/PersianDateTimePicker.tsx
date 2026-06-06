import { Group, Loader, Stack, Text } from '@mantine/core';
import type { SimpleGridProps } from '@mantine/core';
import PersianDatePickerInput from '@/components/shared/PersianDatePickerInput';
import TimeRangeGrid from '@/components/shared/TimeRangeGrid';

type TimeRangeItem = {
  value: string;
  label: string;
};

type PersianDateTimePickerProps = {
  dateLabel?: string;
  datePlaceholder?: string;
  dateValue: string | null;
  onDateChange: (value: string | null) => void;
  dateDisabled?: boolean;

  timeLabel?: string;
  timeValue: string | null;
  onTimeChange: (value: string | null) => void;
  timeData: TimeRangeItem[];
  disabledTimes?: string[];
  timeLoading?: boolean;
  allowTimeDeselect?: boolean;
  timeGridCols?: SimpleGridProps['cols'];
};

export default function PersianDateTimePicker({
  dateLabel,
  datePlaceholder,
  dateValue,
  onDateChange,
  dateDisabled,
  timeLabel = 'ساعت',
  timeValue,
  onTimeChange,
  timeData,
  disabledTimes,
  timeLoading,
  allowTimeDeselect = true,
  timeGridCols = { base: 2, '240px': 3, '360px': 4 },
}: PersianDateTimePickerProps) {
  return (
    <Stack gap='sm'>
      <PersianDatePickerInput
        label={dateLabel}
        placeholder={datePlaceholder}
        value={dateValue}
        onChange={onDateChange}
        disabled={dateDisabled}
      />

      {dateValue ? (
        <Stack gap={6}>
          <Text size='sm'>{timeLabel}</Text>
          {timeLoading ? (
            <Group justify='center' py='xs'>
              <Loader size='sm' />
            </Group>
          ) : (
            <TimeRangeGrid
              value={timeValue}
              onChange={onTimeChange}
              data={timeData}
              allowDeselect={allowTimeDeselect}
              disabledValues={disabledTimes}
              simpleGridProps={{
                cols: timeGridCols,
                spacing: 'xs',
              }}
            />
          )}
        </Stack>
      ) : null}
    </Stack>
  );
}
