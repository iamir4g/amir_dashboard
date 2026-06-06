import { useMemo, useState } from 'react';
import { Button, Card, Group, Loader, Modal, Select, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_DATA_STORAGE_KEY } from '@/constants/app.constant';
import { useGetBookInspectionQuery } from '@/features/supply/api/getBookInspection';
import { useGetAllGaragesQuery } from '@/features/supply/api/getAllGarages';
import { useGetGaragesInventoryQuery } from '@/features/supply/api/getGrages-inventory';
import { usePostBookInspectionMutation } from '@/features/supply/api/postBook-inspection';
import PersianDateTimePicker from '@/components/shared/PersianDateTimePicker';
import type { Garage } from '@/types/Garage';
import type { GarageInventory } from '@/types/GarageInventory';
import { toPersianDigits } from '@/utils/digits';
import { formatDateOnly, formatPersianDateLong, toTimeHHmm } from '@/utils/date';

type BookingInspectionSectionProps = {
  carId: number;
};

type BookingFormValues = {
  garageId: string;
  date: string | null;
  time: string | null;
};

const isInventoryAvailable = (inv: GarageInventory): boolean => {
  return inv.status === 'AVAILABLE' && inv.consumer_id === null && inv.reserved_at === null;
};

export default function BookingInspectionSection({ carId }: BookingInspectionSectionProps) {
  const queryClient = useQueryClient();
  const [opened, setOpened] = useState(false);

  const adminId = useMemo(() => {
    try {
      const raw = localStorage.getItem(AUTH_DATA_STORAGE_KEY);
      if (!raw) return NaN;
      const parsed = JSON.parse(raw) as { user_info?: { id?: number } } | null;
      return Number(parsed?.user_info?.id);
    } catch {
      return NaN;
    }
  }, []);

  const bookInspectionQuery = useGetBookInspectionQuery({
    page: 1,
    page_size: 1,
    car_id: carId,
    order: 'created_at desc',
  });

  const latestBooking = Array.isArray(bookInspectionQuery.data)
    ? bookInspectionQuery.data[0]
    : undefined;

  const garagesQuery = useGetAllGaragesQuery();
  const garages = Array.isArray(garagesQuery.data) ? garagesQuery.data : [];

  const form = useForm<BookingFormValues>({
    initialValues: {
      garageId: '',
      date: formatDateOnly(new Date()),
      time: null,
    },
  });

  const garageOptions = useMemo(
    () => garages.map((g: Garage) => ({ value: String(g.id), label: g.name })),
    [garages]
  );

  const selectedDateOnly = useMemo(() => {
    return form.values.date ?? '';
  }, [form.values.date]);

  const inventoryQueryParams = useMemo(() => {
    const garageIdNumber = Number(form.values.garageId);
    if (!Number.isFinite(garageIdNumber)) return undefined;
    if (!selectedDateOnly) return undefined;
    return {
      page: 1,
      page_size: 100,
      garage_id: garageIdNumber,
      date: selectedDateOnly,
      order: 'start_time asc',
    };
  }, [form.values.garageId, selectedDateOnly]);

  const inventoriesQuery = useGetGaragesInventoryQuery(inventoryQueryParams);
  const inventories = Array.isArray(inventoriesQuery.data) ? inventoriesQuery.data : [];

  const timeSlots = useMemo(() => {
    const unique = new Map<string, { start_time: string; end_time: string; available: boolean }>();
    inventories.forEach((inv) => {
      const available = isInventoryAvailable(inv);
      if (!inv.start_time || !inv.end_time) return;
      const key = `${inv.start_time}|${inv.end_time}`;
      const prev = unique.get(key);
      if (!prev) {
        unique.set(key, { start_time: inv.start_time, end_time: inv.end_time, available });
        return;
      }
      unique.set(key, { ...prev, available: prev.available || available });
    });

    const sorted = Array.from(unique.entries()).sort((a, b) =>
      a[1].start_time.localeCompare(b[1].start_time)
    );

    const items = sorted.map(([key, slot]) => {
      const start = toTimeHHmm(slot.start_time);
      const end = toTimeHHmm(slot.end_time);
      return { value: key, label: toPersianDigits(`${start} الی ${end}`) };
    });

    const disabledValues = sorted.filter(([_, slot]) => !slot.available).map(([key]) => key);

    const firstAvailableInventoryByKey = new Map<string, GarageInventory>();
    inventories.forEach((inv) => {
      if (!isInventoryAvailable(inv)) return;
      if (!inv.start_time || !inv.end_time) return;
      const key = `${inv.start_time}|${inv.end_time}`;
      if (!firstAvailableInventoryByKey.has(key)) {
        firstAvailableInventoryByKey.set(key, inv);
      }
    });

    return { items, disabledValues, firstAvailableInventoryByKey };
  }, [inventories]);

  const selectedInventory = useMemo(() => {
    if (!form.values.time) return undefined;
    return timeSlots.firstAvailableInventoryByKey.get(form.values.time);
  }, [form.values.time, timeSlots.firstAvailableInventoryByKey]);

  const postBookInspection = usePostBookInspectionMutation();

  const handleOpen = () => {
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
    form.reset();
  };

  const handleSubmit = async (values: BookingFormValues) => {
    const garageIdNumber = Number(values.garageId);
    if (!Number.isFinite(garageIdNumber)) return;
    if (!values.date) return;
    if (!Number.isFinite(adminId)) return;

    const pickedInventory = values.time
      ? timeSlots.firstAvailableInventoryByKey.get(values.time)
      : undefined;
    if (!pickedInventory) return;

    await postBookInspection.mutateAsync({
      status: 'WAITING',
      admin_id: adminId,
      car_id: carId,
      car_v2_id: carId,
      garage_id: garageIdNumber,
      date: pickedInventory.date,
      start_time: pickedInventory.start_time,
      end_time: pickedInventory.end_time,
    });

    await queryClient.invalidateQueries({ queryKey: ['booking-inspection', 'list'] });
    handleClose();
  };

  return (
    <Card withBorder radius='md' p='lg'>
      <Group justify='space-between' align='center' mb='sm'>
        <Text fw={700}>رزرو کارشناسی</Text>
        {bookInspectionQuery.isLoading ? <Loader size='sm' /> : null}
      </Group>

      {bookInspectionQuery.isLoading ? null : latestBooking?.inventory ? (
        <Stack gap='xs'>
          <Text size='sm' c='dimmed'>
            گاراژ: {latestBooking.garage?.name}
          </Text>
          <Text size='sm' c='dimmed'>
            تاریخ: {formatPersianDateLong(latestBooking.inventory.date)}
          </Text>
          <Text size='sm' c='dimmed'>
            ساعت: {toPersianDigits(toTimeHHmm(latestBooking.inventory.start_time))} الی{' '}
            {toPersianDigits(toTimeHHmm(latestBooking.inventory.end_time))}
          </Text>
        </Stack>
      ) : (
        <Stack gap='sm'>
          <Text size='sm' c='dimmed'>
            رزروی برای این خودرو ثبت نشده
          </Text>
          <Button onClick={handleOpen} disabled={!Number.isFinite(adminId)}>
            رزرو زمان کارشناسی
          </Button>
          {!Number.isFinite(adminId) ? (
            <Text size='xs' c='dimmed'>
              برای رزرو، admin_id در سشن یافت نشد
            </Text>
          ) : null}
        </Stack>
      )}

      <Modal opened={opened} onClose={handleClose} title='رزرو زمان کارشناسی' centered>
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Stack gap='sm'>
            <Select
              label='گاراژ'
              placeholder='انتخاب گاراژ'
              data={garageOptions}
              searchable
              clearable
              value={form.values.garageId}
              onChange={(value) => {
                form.setFieldValue('garageId', value ?? '');
                form.setFieldValue('time', null);
              }}
              disabled={garagesQuery.isLoading}
            />

            <PersianDateTimePicker
              dateLabel='تاریخ'
              datePlaceholder='انتخاب تاریخ'
              dateValue={form.values.date}
              onDateChange={(value) => {
                form.setFieldValue('date', value);
                form.setFieldValue('time', null);
              }}
              timeValue={form.values.time}
              onTimeChange={(value) => form.setFieldValue('time', value)}
              timeData={timeSlots.items}
              disabledTimes={timeSlots.disabledValues}
              timeLoading={inventoriesQuery.isLoading}
            />

            {selectedInventory ? (
              <Text size='xs' c='dimmed'>
                بازه انتخاب‌شده: {toPersianDigits(toTimeHHmm(selectedInventory.start_time))} الی{' '}
                {toPersianDigits(toTimeHHmm(selectedInventory.end_time))}
              </Text>
            ) : null}

            <Group justify='flex-end'>
              <Button variant='default' onClick={handleClose}>
                خیر
              </Button>
              <Button
                type='submit'
                loading={postBookInspection.isPending}
                disabled={!form.values.garageId || !form.values.time || !Number.isFinite(adminId)}
              >
                بله
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Card>
  );
}
