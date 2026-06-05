import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AspectRatio,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Pagination,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useGetCarsQuery } from '@/features/supply/api/getCars';
import { useGetAllNoteCarQuery } from '@/features/supply/api/getAllNoteCar';
import { usePostNoteCarMutation } from '@/features/supply/api/postNoteCar';
import type { Note } from '@/types/Cars';
import { AUTH_DATA_STORAGE_KEY } from '@/constants/app.constant';

export default function CarDeatils() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = Number(id);
  const defaultPageSize = 10;

  const [notesPage, setNotesPage] = useState(1);
  const [noteText, setNoteText] = useState('');
  const [optimisticNotes, setOptimisticNotes] = useState<Note[]>([]);

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

  const { data, isLoading } = useGetCarsQuery(
    Number.isFinite(numericId) ? { ids: String(numericId) } : undefined
  );

  const car = Array.isArray(data) ? data[0] : undefined;

  const formatDateTime = useMemo(() => {
    return (value?: string) => {
      if (!value) return '';
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return '';
      return date.toLocaleString('fa-IR-u-ca-persian');
    };
  }, []);

  const galleryUrls = useMemo(() => {
    const raw = car?.gallery ?? [];
    return raw.map((x) => x.name || x.thumb_name).filter((x): x is string => Boolean(x));
  }, [car?.gallery]);

  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const galleryUrl =
    galleryUrls.length > 0 ? galleryUrls[Math.min(activeGalleryIndex, galleryUrls.length - 1)] : '';

  const notesQueryParams = useMemo(() => {
    if (!Number.isFinite(numericId)) return undefined;

    return {
      page: notesPage,
      page_size: defaultPageSize,
      order: 'created_at desc',
      car_v2_id: numericId,
      ...(Number.isFinite(adminId) ? { admin_id: adminId } : {}),
    };
  }, [adminId, notesPage, numericId]);

  const notesQuery = useGetAllNoteCarQuery(notesQueryParams);
  const postNoteMutation = usePostNoteCarMutation();

  useEffect(() => {
    setNotesPage(1);
    setOptimisticNotes([]);
    setNoteText('');
  }, [numericId]);

  const notesItems = useMemo(() => {
    const apiNotes = Array.isArray(notesQuery.data) ? notesQuery.data : [];
    if (optimisticNotes.length === 0) return apiNotes;

    const optimisticIds = new Set(optimisticNotes.map((n) => n.id));
    return [...optimisticNotes, ...apiNotes.filter((n) => !optimisticIds.has(n.id))];
  }, [notesQuery.data, optimisticNotes]);

  const hasNextNotesPage = (notesQuery.data?.length ?? 0) === defaultPageSize;
  const notesPaginationTotal = Math.max(1, hasNextNotesPage ? notesPage + 1 : notesPage);

  const handleSubmitNote = async () => {
    const text = noteText.trim();
    if (!text) return;
    if (!Number.isFinite(adminId)) return;
    if (!Number.isFinite(numericId)) return;

    if (notesPage !== 1) {
      setNotesPage(1);
    }

    const tempId = -Date.now();
    const optimistic: Note = {
      id: tempId,
      admin_id: adminId,
      car_v2_id: numericId,
      text,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };

    setOptimisticNotes([optimistic]);
    setNoteText('');

    try {
      const created = await postNoteMutation.mutateAsync({
        admin_id: adminId,
        car_v2_id: numericId,
        text,
      });

      const createdNote: Note = {
        ...optimistic,
        ...created,
        text: created.text ?? optimistic.text,
        created_at: created.created_at ?? optimistic.created_at,
        updated_at: created.updated_at ?? optimistic.updated_at,
      };

      setOptimisticNotes((prev) => prev.map((n) => (n.id === tempId ? createdNote : n)));
      await notesQuery.refetch();
    } catch {
      setOptimisticNotes((prev) => prev.filter((n) => n.id !== tempId));
    }
  };

  if (!Number.isFinite(numericId)) {
    return (
      <Container fluid>
        <Group justify='space-between' align='center' mb='md'>
          <Title order={4}>جزئیات خودرو</Title>
          <Button variant='default' onClick={() => navigate(-1)}>
            بازگشت
          </Button>
        </Group>
        <Card withBorder radius='md' p='lg'>
          <Text c='dimmed'>شناسه نامعتبر است</Text>
        </Card>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container fluid>
        <Group justify='space-between' align='center' mb='md'>
          <Title order={4}>جزئیات خودرو</Title>
          <Button variant='default' onClick={() => navigate(-1)}>
            بازگشت
          </Button>
        </Group>
        <Center py='xl'>
          <Loader />
        </Center>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container fluid>
        <Group justify='space-between' align='center' mb='md'>
          <Title order={4}>جزئیات خودرو</Title>
          <Button variant='default' onClick={() => navigate(-1)}>
            بازگشت
          </Button>
        </Group>
        <Card withBorder radius='md' p='lg'>
          <Text c='dimmed'>خودرو با این شناسه پیدا نشد</Text>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Group justify='space-between' align='center' mb='md'>
        <Stack gap={2}>
          <Group gap='xs'>
            <Title order={4}>
              {car.brand?.name_fa} {car.model?.name_fa} {car.make_year}
            </Title>
            <Badge variant='light'>{car.status}</Badge>
          </Group>
          <Text size='sm' c='dimmed'>
            {car.code} • {car.city?.name} • {formatDateTime(car.created_at)}
          </Text>
        </Stack>
        <Button variant='default' onClick={() => navigate(-1)}>
          بازگشت
        </Button>
      </Group>

      <Grid gutter='md' style={{ flex: 1, overflow: 'hidden' }}>
        <Grid.Col span={{ base: 12, md: 8 }} style={{ height: '100%', overflow: 'auto' }}>
          <Stack gap='md'>
            <Card withBorder radius='md' p='lg'>
              <Group justify='space-between' align='center'>
                <Text fw={700}>مشخصات کلی</Text>
                <Badge variant='outline'>{car.channel}</Badge>
              </Group>
              <Divider my='md' />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='sm'>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    مالک
                  </Text>
                  <Text fw={600} size='sm'>
                    {car.user?.first_name} {car.user?.last_name}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    شماره تماس
                  </Text>
                  <Text fw={600} size='sm'>
                    {car.user?.phone}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    پارکینگ
                  </Text>
                  <Text fw={600} size='sm'>
                    {car.garage?.name}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    نوع ورودی
                  </Text>
                  <Text fw={600} size='sm'>
                    {car.inbound_type}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    رنگ
                  </Text>
                  <Text fw={600} size='sm'>
                    {car.color}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    کارکرد
                  </Text>
                  <Text fw={600} size='sm'>
                    {Number(car.mileage ?? 0).toLocaleString('fa-IR')} کیلومتر
                  </Text>
                </Group>
              </SimpleGrid>
              <Divider my='md' />
              <Group>
                <Text c='dimmed' size='sm'>
                  مشکلات بدنه :
                </Text>
                {car.body_condition
                  ?.filter((bodyCondition) => bodyCondition.value)
                  .map((bodyCondition) => (
                    <Badge key={bodyCondition.id} variant='light' color='red'>
                      {bodyCondition.key_fa}
                    </Badge>
                  ))}
              </Group>
              <Divider my='md' />
              <Text c='dimmed' size='sm'>
                توضیحات بیشتر :
              </Text>
              <Text size='sm'>{car.description}</Text>
            </Card>

            <Card withBorder radius='md' p='lg'>
              <Text fw={700} mb='sm'>
                گالری تصاویر خودرو
              </Text>
              {galleryUrls.length === 0 ? (
                <Text size='sm' c='dimmed'>
                  تصویری ثبت نشده
                </Text>
              ) : (
                <>
                  <AspectRatio ratio={16 / 9} maw={1100}>
                    <Image src={galleryUrl} alt='car-gallery' fit='cover' />
                  </AspectRatio>
                  <Divider my='md' />
                  <SimpleGrid cols={{ base: 3, sm: 5 }} spacing='sm'>
                    {galleryUrls.map((url, index) => (
                      <Card
                        key={url}
                        withBorder
                        radius='sm'
                        p={0}
                        onClick={() => setActiveGalleryIndex(index)}
                        style={{
                          cursor: 'pointer',
                          overflow: 'hidden',
                          borderColor:
                            index === activeGalleryIndex
                              ? 'var(--mantine-color-blue-6)'
                              : undefined,
                        }}
                      >
                        <AspectRatio ratio={16 / 9}>
                          <Image src={url} alt={`car-gallery-${index}`} fit='cover' />
                        </AspectRatio>
                      </Card>
                    ))}
                  </SimpleGrid>
                </>
              )}
            </Card>

            <Card withBorder radius='md' p='lg'>
              <Text fw={700} mb='sm'>
                تصاویر مدارک
              </Text>
              <Text size='sm' c='dimmed'>
                فعلا داده‌ای وجود ندارد
              </Text>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }} style={{ height: '100%' }}>
          <Card
            withBorder
            radius='md'
            p='lg'
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Group justify='space-between' align='center'>
              <Text fw={700}>یادداشت‌ها</Text>
              <Group gap='xs'>
                <Badge variant='light'>{notesItems.length}</Badge>
                <Badge variant='outline'>صفحه {notesPage}</Badge>
              </Group>
            </Group>
            <Divider my='md' />
            <Stack gap='xs' mb='md'>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.currentTarget.value)}
                placeholder='یادداشت جدید...'
                autosize
                minRows={3}
              />
              <Button
                onClick={handleSubmitNote}
                loading={postNoteMutation.isPending}
                disabled={!Number.isFinite(adminId) || noteText.trim().length === 0}
              >
                ثبت
              </Button>
              {!Number.isFinite(adminId) ? (
                <Text size='xs' c='dimmed'>
                  برای ثبت یادداشت، admin_id در سشن یافت نشد
                </Text>
              ) : null}
            </Stack>
            <ScrollArea style={{ flex: 1 }} offsetScrollbars>
              <Stack gap='sm'>
                {notesQuery.isLoading ? (
                  <Center py='md'>
                    <Loader size='sm' />
                  </Center>
                ) : notesItems.length === 0 ? (
                  <Text size='sm' c='dimmed'>
                    یادداشتی ثبت نشده
                  </Text>
                ) : (
                  notesItems.map((note) => (
                    <Card key={note.id} withBorder radius='md' p='sm'>
                      <Group justify='space-between' align='center' mb={6}>
                        <Text size='xs' c='dimmed'>
                          {formatDateTime(note.created_at)}
                        </Text>
                      </Group>
                      <Text size='sm'>{note.text}</Text>
                    </Card>
                  ))
                )}
              </Stack>
            </ScrollArea>
            <Group justify='center' mt='md'>
              <Pagination
                value={notesPage}
                onChange={setNotesPage}
                total={notesPaginationTotal}
                disabled={notesQuery.isFetching}
              />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
