import { Card, Text, Group, Stack, Badge, Divider, useMantineTheme } from '@mantine/core';
import type { CarsStatus } from '@/constants/Car.status';
import CarManagementCardActions, { type CarManagementAction } from './CarManagementCardActions';
import { useTranslation } from 'react-i18next';
import { CarValue } from '@/types/Cars';

// ۱. تعریف Type برای پاپس‌ها (TypeScript)
interface CarCardProps {
  car: CarValue;
  statuses: { label: string; color: string }[];
  status: CarsStatus;
  onCardClick?: () => void;
  onAction?: (action: CarManagementAction) => void;
}

export function CarManagementCard({ car, statuses, status, onCardClick, onAction }: CarCardProps) {
  const theme = useMantineTheme();
  const { t } = useTranslation();
  return (
    <Card
      shadow='sm'
      padding='lg'
      radius='md'
      withBorder
      onClick={onCardClick}
      style={{
        overflow: 'visible',
        cursor: onCardClick ? 'pointer' : 'default',
      }}
    >
      {/* بخش اصلی: اطلاعات ماشین و مالک */}
      <Stack gap='sm'>
        {/* هدر کارت: */}
        <Group justify='space-between' align='flex-start'>
          <Stack gap={2}>
            <Text fw={700} size='lg' c='blue.7'>
              {`${car.brand?.name_fa ?? ''} ${car.model?.name_fa ?? ''} ${car.make_year ?? ''}`.trim()}
            </Text>

            <Text size='sm' fw={500} c='dimmed'>
              کارکرد: {car.mileage}
            </Text>

            <Text size='sm' fw={500} c='dimmed'>
              قیمت اعلامی: {car.price_record?.final}
            </Text>
          </Stack>
          <Badge variant='light' color='gray' size='md' radius='sm'>
            {car.code}
          </Badge>
        </Group>

        <Divider variant='dashed' />

        {/* اطلاعات مالک خودرو */}
        <Group justify='space-between' wrap='nowrap'>
          <Stack gap={2}>
            <Text size='xs' c='dimmed'>
              مالک خودرو
            </Text>
            <Text size='sm' fw={600}>
              {`${car.user?.first_name ?? ''} ${car.user?.last_name ?? ''}`.trim() || '---'}
            </Text>
          </Stack>

          <Stack gap={2} align='flex-end'>
            <Text size='xs' c='dimmed'>
              شماره تماس
            </Text>
            <Text size='sm' fw={600} lts='1px'>
              {car.user?.phone ?? '---'}
            </Text>
          </Stack>
        </Group>
      </Stack>

      {/* بخش فوتر: استاتوس‌های سیستم فروش */}
      <Card.Section
        bg={theme.colors.gray[0]}
        mt='lg'
        p='md'
        style={{ borderTop: `1px solid ${theme.colors.gray[2]}` }}
      >
        <Stack gap='xs'>
          <Text size='xs' fw={700} c='dimmed'>
            {t('status.statuses')}
          </Text>

          {/* نمایش بچ‌ها کنار هم با قابلیت جابجایی در ریسپانسیو */}
          <Group gap={6} wrap='wrap'>
            {statuses.map((status, index) => (
              <Badge key={index} variant='dot' color={status.color} size='sm' radius='xl'>
                {t(`status.${status.label}`)}
              </Badge>
            ))}
          </Group>

          <Divider variant='dashed' />
          <CarManagementCardActions status={status} carId={car.id} onAction={onAction} />
        </Stack>
      </Card.Section>
    </Card>
  );
}
