import { Button, Collapse, Group, Paper, Popover, SimpleGrid, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import React, { useMemo, useState } from 'react';
import type { GetCarsQueryParams } from '@/types/Cars'; // رفرنس به فایل تایپ پروژه شما

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

  const formatPersianDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return (value: Date | null) => (value ? formatter.format(value) : '');
  }, []);

  const parseIsoDate = (value?: string) => {
    if (!value) return null;
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return null;
    return date;
  };

  const toIsoDate = (value: Date) => value.toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState<Date | null>(() =>
    parseIsoDate(initialValues?.from_date)
  );
  const [toDate, setToDate] = useState<Date | null>(() => parseIsoDate(initialValues?.to_date));

  const [fromOpened, setFromOpened] = useState(false);
  const [toOpened, setToOpened] = useState(false);

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

          if (fromDate) cleanedFilters.from_date = toIsoDate(fromDate);
          if (toDate) cleanedFilters.to_date = toIsoDate(toDate);

          onSubmit?.(cleanedFilters);
        })}
      >
        <SimpleGrid cols={isSmall ? 1 : 4} spacing='md' verticalSpacing='md'>
          <TextInput
            label='شماره تماس'
            placeholder='مثلاً 09123456789'
            {...form.getInputProps('phone')}
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
            />

            <TextInput
              label='شناسه ثبت (Submission ID)'
              placeholder='مثلاً 4567'
              {...form.getInputProps('car_submission_id')}
            />
            <TextInput
              label='شناسه کاربر (User ID)'
              placeholder='کد کاربر'
              {...form.getInputProps('user_id')}
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
            />
            <TextInput
              label='مرتب‌سازی (Order)'
              placeholder='نحوه مرتب‌سازی'
              {...form.getInputProps('order')}
            />
            <Popover opened={fromOpened} onChange={setFromOpened} position='bottom-start' withArrow>
              <Popover.Target>
                <TextInput
                  label='از تاریخ'
                  placeholder='انتخاب تاریخ'
                  readOnly
                  value={formatPersianDate(fromDate)}
                  onClick={() => setFromOpened(true)}
                />
              </Popover.Target>
              <Popover.Dropdown>
                <DatePicker
                  value={fromDate}
                  onChange={(value) => {
                    setFromDate(value);
                    setFromOpened(false);
                  }}
                />
              </Popover.Dropdown>
            </Popover>

            <Popover opened={toOpened} onChange={setToOpened} position='bottom-start' withArrow>
              <Popover.Target>
                <TextInput
                  label='تا تاریخ'
                  placeholder='انتخاب تاریخ'
                  readOnly
                  value={formatPersianDate(toDate)}
                  onClick={() => setToOpened(true)}
                />
              </Popover.Target>
              <Popover.Dropdown>
                <DatePicker
                  value={toDate}
                  onChange={(value) => {
                    setToDate(value);
                    setToOpened(false);
                  }}
                />
              </Popover.Dropdown>
            </Popover>
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
