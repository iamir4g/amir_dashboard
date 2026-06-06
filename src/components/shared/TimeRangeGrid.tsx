import { Button, SimpleGrid } from '@mantine/core';
import type { SimpleGridProps } from '@mantine/core';

type TimeRangeGridItem = {
  value: string;
  label: string;
};

type TimeRangeGridProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  data: TimeRangeGridItem[];
  disabledValues?: string[];
  allowDeselect?: boolean;
  disabled?: boolean;
  simpleGridProps?: SimpleGridProps;
};

export default function TimeRangeGrid({
  value,
  onChange,
  data,
  disabledValues,
  allowDeselect,
  disabled,
  simpleGridProps,
}: TimeRangeGridProps) {
  const disabledSet = new Set(disabledValues ?? []);

  return (
    <SimpleGrid spacing='xs' {...simpleGridProps}>
      {data.map((item) => {
        const isDisabled = Boolean(disabled) || disabledSet.has(item.value);
        const isActive = value === item.value;

        return (
          <Button
            key={item.value}
            variant={isActive ? 'filled' : 'light'}
            color={isDisabled ? 'gray' : 'blue'}
            disabled={isDisabled}
            size='sm'
            onClick={() => {
              if (isDisabled) return;
              if (allowDeselect && isActive) {
                onChange(null);
                return;
              }
              onChange(item.value);
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </SimpleGrid>
  );
}
