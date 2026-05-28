import { Button, Group, Paper, Select, SimpleGrid, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

export type GlobalFilterValues = {
  phoneNumber: string;
  contractNumber: string;
  chassisNumber: string;
  status: string | null;
};

type GlobalFilterBarProps = {
  initialValues?: Partial<GlobalFilterValues>;
  onSubmit?: (values: GlobalFilterValues) => void;
  statusOptions?: Array<{ value: string; label: string }>;
};

const defaultStatusOptions: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'همه' },
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' },
];

export default function GlobalFilterBar({
  initialValues,
  onSubmit,
  statusOptions = defaultStatusOptions,
}: GlobalFilterBarProps) {
  const isSmall = useMediaQuery('(max-width: 48em)');

  const form = useForm<GlobalFilterValues>({
    initialValues: {
      phoneNumber: initialValues?.phoneNumber ?? '',
      contractNumber: initialValues?.contractNumber ?? '',
      chassisNumber: initialValues?.chassisNumber ?? '',
      status: initialValues?.status ?? 'all',
    },
  });

  return (
    <Paper withBorder radius='md' p='md'>
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit?.(values);
        })}
      >
        <SimpleGrid cols={isSmall ? 1 : 4} spacing='md' verticalSpacing='md'>
          <TextInput
            label='شماره تماس'
            placeholder='مثلاً 09123456789'
            {...form.getInputProps('phoneNumber')}
          />
          <TextInput
            label='شماره قرارداد'
            placeholder='مثلاً 12345'
            {...form.getInputProps('contractNumber')}
          />
          <TextInput
            label='شماره شاسی'
            placeholder='مثلاً WAUZZZ...'
            {...form.getInputProps('chassisNumber')}
          />
          <Select
            label='وضعیت'
            placeholder='انتخاب کنید'
            data={statusOptions}
            searchable={false}
            clearable={false}
            {...form.getInputProps('status')}
          />
        </SimpleGrid>

        <Group justify='flex-end' mt='md'>
          <Button
            variant='default'
            onClick={() => {
              form.reset();
              onSubmit?.(form.values);
            }}
          >
            پاک کردن
          </Button>
          <Button type='submit'>اعمال فیلتر</Button>
        </Group>
      </form>
    </Paper>
  );
}
