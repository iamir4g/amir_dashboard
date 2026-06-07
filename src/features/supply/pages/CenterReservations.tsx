import React, { useMemo, useState } from 'react';
import { Accordion, Center, Divider, Group, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import GlobalFilterBar from '@/components/shared/GlobalFilterBar/GlobalFilterBar';
import { CarManagementCard } from '@/components/shared/Car/CarManagementCard';
import { useNavigate } from 'react-router-dom';
import type { GetCarsQueryParams } from '@/types/Cars';
import type { CarsStatus } from '@/constants/Car.status';
import { ADMIN_REJECTED, INSPECTION_BOOKED, SOLD } from '@/constants/Car.status';
import { useGetBookInspectionByDateQuery } from '../api/getBookinspectionByDate';
import type { GetBookInspectionByDateQueryParams } from '@/types/BookingInspection';

export default function CenterReservations() {
  const navigate = useNavigate();

  const defaultParams: GetCarsQueryParams = { page: 1, page_size: 10, status: INSPECTION_BOOKED };
  const [params, setParams] = useState<GetCarsQueryParams>(defaultParams);

  const queryParams = useMemo<GetBookInspectionByDateQueryParams>(
    () => ({
      from: params.from_date,
      to: params.to_date,
      phone: params.phone,
      code: params.code,
      order: params.order,
      garage_id: params.garage_id ? Number(params.garage_id) : undefined,
      // status: 'INSPECTION_BOOKED',
      is_admin: true,
    }),
    [params]
  );

  const { data, isLoading } = useGetBookInspectionByDateQuery(queryParams);

  const dateKeys = useMemo(() => {
    const keys = Object.keys(data ?? {});
    return keys.sort((a, b) => a.localeCompare(b));
  }, [data]);

  const totalItemsCount = useMemo(
    () => dateKeys.reduce((sum, key) => sum + (data?.[key]?.length ?? 0), 0),
    [data, dateKeys]
  );

  return (
    <div className='w-full'>
      <GlobalFilterBar
        initialValues={params}
        onSubmit={(values) => {
          setParams({ ...defaultParams, ...values, status: INSPECTION_BOOKED });
        }}
      />
      <Divider my={10} />

      <Group justify='space-between' align='center' mb='md'>
        <Text fw={600}>رزرو های سنتر</Text>
        <Text size='sm' c='dimmed'>
          {totalItemsCount} مورد
        </Text>
      </Group>

      {isLoading ? (
        <Center py='xl'>
          <Loader />
        </Center>
      ) : totalItemsCount === 0 ? (
        <Center py='xl'>
          <Text c='dimmed'>موردی پیدا نشد</Text>
        </Center>
      ) : (
        <Stack gap='md'>
          <Accordion multiple variant='separated'>
            {dateKeys.map((dateKey) => {
              const inspections = data?.[dateKey] ?? [];
              const carItems = inspections
                .map((x) => ({ inspectionId: x.id, car: x.car }))
                .filter((x) => Boolean(x.car?.id));

              return (
                <Accordion.Item key={dateKey} value={dateKey}>
                  <Accordion.Control>
                    <Group justify='space-between' align='center' w='100%'>
                      <Text fw={600}>{dateKey}</Text>
                      <Text size='sm' c='dimmed'>
                        {carItems.length} مورد
                      </Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    {carItems.length === 0 ? (
                      <Center py='md'>
                        <Text c='dimmed'>موردی پیدا نشد</Text>
                      </Center>
                    ) : (
                      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
                        {carItems.map(({ inspectionId, car }) => (
                          <CarManagementCard
                            key={`${dateKey}-${inspectionId}`}
                            car={car!}
                            onCardClick={() => navigate(`/car-deatils/${car!.id}`)}
                            status={INSPECTION_BOOKED as CarsStatus}
                            statuses={[
                              {
                                label: INSPECTION_BOOKED,
                                color:
                                  car!.status === SOLD
                                    ? 'green'
                                    : car!.status === ADMIN_REJECTED
                                      ? 'red'
                                      : 'blue',
                              },
                            ]}
                          />
                        ))}
                      </SimpleGrid>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </Stack>
      )}
    </div>
  );
}
