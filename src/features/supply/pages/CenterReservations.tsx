import React, { useMemo, useState } from 'react';
import { Center, Divider, Group, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import GlobalFilterBar from '@/components/shared/GlobalFilterBar/GlobalFilterBar';
import { CarManagementCard } from '@/components/shared/Car/CarManagementCard';
import { useNavigate } from 'react-router-dom';
import { useGetCarsQuery } from '../api/getCars';
import type { GetCarsQueryParams } from '@/types/Cars';
import type { CarsStatus } from '@/constants/Car.status';
import { ADMIN_REJECTED, INSPECTION_BOOKED, SOLD } from '@/constants/Car.status';

export default function CenterReservations() {
  const navigate = useNavigate();

  const defaultParams: GetCarsQueryParams = { page: 1, page_size: 10, status: INSPECTION_BOOKED };
  const [params, setParams] = useState<GetCarsQueryParams>(defaultParams);

  const queryParams = useMemo<GetCarsQueryParams>(
    () => ({
      ...params,
      status: INSPECTION_BOOKED as CarsStatus,
    }),
    [params]
  );

  const { data, isLoading } = useGetCarsQuery(queryParams);
  const items = Array.isArray(data) ? data : [];

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
          {items.length} مورد
        </Text>
      </Group>

      {isLoading ? (
        <Center py='xl'>
          <Loader />
        </Center>
      ) : items.length === 0 ? (
        <Center py='xl'>
          <Text c='dimmed'>موردی پیدا نشد</Text>
        </Center>
      ) : (
        <Stack gap='md'>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
            {items.map((car) => (
              <CarManagementCard
                key={car.id}
                car={car}
                onCardClick={() => navigate(`/car-deatils/${car.id}`)}
                status={car.status as CarsStatus}
                statuses={[
                  {
                    label: car.status ?? '',
                    color:
                      car.status === SOLD
                        ? 'green'
                        : car.status === ADMIN_REJECTED
                          ? 'red'
                          : 'blue',
                  },
                ]}
              />
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </div>
  );
}
