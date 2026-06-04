import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Divider,
  Button,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';

// ۱. تعریف Type برای پاپس‌ها (TypeScript)
interface CarCardProps {
  carModel: string;
  plateNumber?: string;
  ownerName: string;
  ownerPhone: string;
  price?: string;
  // فرض می‌کنیم استاتوس‌ها لیستی از وضعیت‌های سیستم فروش شما هستند
  statuses: { label: string; color: string }[];
  onDetailsClick?: () => void;
}

export function CarManagementCard({
  carModel,
  plateNumber = '---',
  ownerName,
  ownerPhone,
  price,
  statuses,
  onDetailsClick,
}: CarCardProps) {
  const theme = useMantineTheme();

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder style={{ overflow: 'visible' }}>
      {/* بخش اصلی: اطلاعات ماشین و مالک */}
      <Stack gap='sm'>
        {/* هدر کارت: مدل ماشین و دکمه جزییات */}
        <Group justify='space-between' align='flex-start'>
          <Stack gap={2}>
            <Text fw={700} size='lg' c='blue.7'>
              {carModel}
            </Text>
            {price && (
              <Text size='sm' fw={500} c='dimmed'>
                قیمت اعلامی: {price}
              </Text>
            )}
          </Stack>
          <Badge variant='light' color='gray' size='md' radius='sm'>
            {plateNumber}
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
              {ownerName}
            </Text>
          </Stack>

          <Stack gap={2} align='flex-end'>
            <Text size='xs' c='dimmed'>
              شماره تماس
            </Text>
            <Text size='sm' fw={600} lts='1px'>
              {ownerPhone}
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
            وضعیت‌های معاملاتی:
          </Text>

          {/* نمایش بچ‌ها کنار هم با قابلیت جابجایی در ریسپانسیو */}
          <Group gap={6} wrap='wrap'>
            {statuses.map((status, index) => (
              <Badge key={index} variant='dot' color={status.color} size='sm' radius='xl'>
                {status.label}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Card.Section>

      {/* دکمه عملیاتی انتهای کارت (اختیاری) */}
      <Button
        variant='light'
        color='blue'
        fullWidth
        mt='md'
        radius='md'
        size='xs'
        onClick={onDetailsClick}
      >
        مدیریت و تغییر وضعیت
      </Button>
    </Card>
  );
}
