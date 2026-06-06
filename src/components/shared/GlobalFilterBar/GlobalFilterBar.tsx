import { Button, Collapse, Group, Paper, SimpleGrid, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import React, { useMemo, useState } from 'react';
import type { GetCarsQueryParams } from '@/types/Cars'; // رفرنس به فایل تایپ پروژه شما
import PersianDatePickerInput from '@/components/shared/PersianDatePickerInput';
import { toEnglishDigits } from '@/utils/digits';

type GlobalFilterBarProps = {
  initialValues?: Partial<GetCarsQueryParams>;
  onSubmit?: (values: GetCarsQueryParams) => void;
};

export default function GlobalFilterBar({ initialValues, onSubmit }: GlobalFilterBarProps) {
  const isSmall = useMediaQuery('(max-width: 48em)');

  const hasAdvancedInitialValues = useMemo(() => {
    const advancedKeys: Array<keyof GetCarsQueryParams> = [
      'garage_id',
      'user_id',
      'car_submission_id',
      'ids',
      'type',
      'inbound_type',
      'order',
      'channel',
      'from_date',
      'to_date',
    ];

    return advancedKeys.some((key) => {
      const value = initialValues?.[key];
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      return true;
    });
  }, [initialValues]);

  const [advancedOpened, setAdvancedOpened] = useState<boolean>(hasAdvancedInitialValues);

  const parseIsoDate = (value?: string) => {
    if (!value) return null;
    const normalized = value.trim();
    if (!normalized) return null;
    return normalized;
  };

  const [fromDate, setFromDate] = useState<string | null>(() =>
    parseIsoDate(initialValues?.from_date)
  );
  const [toDate, setToDate] = useState<string | null>(() => parseIsoDate(initialValues?.to_date));

  const form = useForm<GetCarsQueryParams>({
    initialValues: {
      page: initialValues?.page ?? 1,
      page_size: initialValues?.page_size ?? 10,
      garage_id: initialValues?.garage_id ?? '',
      user_id: initialValues?.user_id ?? '',
      car_submission_id: initialValues?.car_submission_id ?? '',
      ids: initialValues?.ids ?? '',
      type: initialValues?.type ?? '',
      code: initialValues?.code ?? '',
      inbound_type: initialValues?.inbound_type ?? '',
      order: initialValues?.order ?? '',
      channel: initialValues?.channel ?? '',
      phone: initialValues?.phone ?? '',
    },
  });

  return (
    <Paper withBorder radius='md' p='md'>
      <form
        onSubmit={form.onSubmit((values) => {
          const cleanedFilters = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v !== '' && v !== undefined && v !== 'all')
          ) as GetCarsQueryParams;

          if (fromDate) cleanedFilters.from_date = fromDate;
          if (toDate) cleanedFilters.to_date = toDate;

          onSubmit?.(cleanedFilters);
        })}
      >
        <SimpleGrid cols={isSmall ? 1 : 4} spacing='md' verticalSpacing='md'>
          <TextInput
            label='شماره تماس'
            placeholder='مثلاً 09123456789'
            {...form.getInputProps('phone')}
            onChange={(event) => {
              form.setFieldValue('phone', toEnglishDigits(event.currentTarget.value));
            }}
          />
          <TextInput
            label='کد خودرو (Code)'
            placeholder='مثلاً CAR-123'
            {...form.getInputProps('code')}
          />

          <Button
            variant='light'
            color='gray'
            onClick={() => setAdvancedOpened((prev) => !prev)}
            style={{ alignSelf: 'end' }}
          >
            {advancedOpened ? 'بستن فیلترهای بیشتر' : 'فیلترهای بیشتر'}
          </Button>
        </SimpleGrid>

        <Collapse in={advancedOpened} mt='md'>
          <SimpleGrid cols={isSmall ? 1 : 4} spacing='md' verticalSpacing='md'>
            <TextInput
              label='شناسه پارکینگ (Garage ID)'
              placeholder='کد پارکینگ'
              {...form.getInputProps('garage_id')}
              onChange={(event) => {
                form.setFieldValue('garage_id', toEnglishDigits(event.currentTarget.value));
              }}
            />

            <TextInput
              label='شناسه ثبت (Submission ID)'
              placeholder='مثلاً 4567'
              {...form.getInputProps('car_submission_id')}
              onChange={(event) => {
                form.setFieldValue('car_submission_id', toEnglishDigits(event.currentTarget.value));
              }}
            />
            <TextInput
              label='شناسه کاربر (User ID)'
              placeholder='کد کاربر'
              {...form.getInputProps('user_id')}
              onChange={(event) => {
                form.setFieldValue('user_id', toEnglishDigits(event.currentTarget.value));
              }}
            />
            <TextInput
              label='کانال ورودی (Channel)'
              placeholder='مثلاً دیوار'
              {...form.getInputProps('channel')}
            />
            <TextInput
              label='نوع خودرو (Type)'
              placeholder='STATIC یا DEFAULT'
              {...form.getInputProps('type')}
            />
            <TextInput
              label='نوع ورودی (Inbound Type)'
              placeholder='Inbound Type'
              {...form.getInputProps('inbound_type')}
            />
            <TextInput
              label='شناسه‌ها (Ids)'
              placeholder='شناسه‌ها با کاما'
              {...form.getInputProps('ids')}
              onChange={(event) => {
                form.setFieldValue('ids', toEnglishDigits(event.currentTarget.value));
              }}
            />
            <TextInput
              label='مرتب‌سازی (Order)'
              placeholder='نحوه مرتب‌سازی'
              {...form.getInputProps('order')}
            />
            <PersianDatePickerInput
              label='از تاریخ'
              placeholder='انتخاب تاریخ'
              value={fromDate}
              onChange={setFromDate}
            />

            <PersianDatePickerInput
              label='تا تاریخ'
              placeholder='انتخاب تاریخ'
              value={toDate}
              onChange={setToDate}
            />
          </SimpleGrid>
        </Collapse>

        <Group justify='flex-end' mt='md'>
          <Button
            variant='default'
            onClick={() => {
              form.reset();
              setFromDate(null);
              setToDate(null);
              setAdvancedOpened(false);
              onSubmit?.({});
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
