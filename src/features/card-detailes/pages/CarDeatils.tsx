import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ActionIcon,
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
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { IconCheck, IconPencil, IconX } from '@tabler/icons-react';
import { useGetCarsQuery } from '@/features/supply/api/getCars';
import { useGetAllNoteCarQuery } from '@/features/supply/api/getAllNoteCar';
import { usePostNoteCarMutation } from '@/features/supply/api/postNoteCar';
import type { Note } from '@/types/Cars';
import { AUTH_DATA_STORAGE_KEY } from '@/constants/app.constant';
import BookingInspectionSection from '@/features/card-detailes/components/BookingInspectionSection';
import NoteCard from '@/features/card-detailes/components/NoteCard';
import { toEnglishDigits, toPersianDigits } from '@/utils/digits';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { usePatchCarMutation } from '@/features/supply/api/patchCar';
import { useGetAllBrandQuery } from '@/features/supply/api/getAllBrand';
import { useGetAllModelsQuery } from '@/features/supply/api/getAllModels';

export default function CarDeatils() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = Number(id);
  const defaultPageSize = 10;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const patchCarMutation = usePatchCarMutation();

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

  type EditableFieldKey = 'brand_id' | 'model_id' | 'trim_id' | 'make_year' | 'color' | 'mileage';

  const [editingField, setEditingField] = useState<EditableFieldKey | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [editError, setEditError] = useState('');

  const { data, isLoading } = useGetCarsQuery(
    Number.isFinite(numericId) ? { ids: String(numericId) } : undefined
  );

  const car = Array.isArray(data) ? data[0] : undefined;
  const isEditingBrand = editingField === 'brand_id';
  const isEditingModel = editingField === 'model_id';

  const brandsQuery = useGetAllBrandQuery(undefined, { enabled: isEditingBrand || isEditingModel });
  const brandOptions = useMemo(
    () =>
      (brandsQuery.data ?? [])
        .map((b) => ({
          value: String(b.id),
          label: `${b.name_fa} (${toPersianDigits(String(b.id))})`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'fa')),
    [brandsQuery.data]
  );

  const modelsQuery = useGetAllModelsQuery(
    isEditingModel && Number.isFinite(car?.brand_id ?? NaN)
      ? { brand_id: Number(car?.brand_id), page_size: 0 }
      : undefined
  );

  const modelOptions = useMemo(
    () =>
      (modelsQuery.data ?? [])
        .map((m) => ({
          value: String(m.id),
          label: `${m.name_fa} (${toPersianDigits(String(m.id))})`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'fa')),
    [modelsQuery.data]
  );

  const formatDateTime = useMemo(() => {
    return (value?: string) => {
      if (!value) return '';
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return '';
      return date.toLocaleString('fa-IR-u-ca-persian');
    };
  }, []);

  const formatPriceValue = useMemo(() => {
    return (value?: string | null) => {
      const raw = String(value ?? '').trim();
      if (!raw) return '---';
      const normalized = raw.replace(/,/g, '');
      const n = Number(normalized);
      if (Number.isFinite(n)) return n.toLocaleString('fa-IR');
      return toPersianDigits(raw);
    };
  }, []);

  const badgeLabel = useMemo(() => {
    return (value?: string | null) => {
      const raw = String(value ?? '').trim();
      if (!raw) return '';
      const key = raw.startsWith('badge.')
        ? raw
        : raw.startsWith('Badge')
          ? `badge.${raw}`
          : `badge.Badge${raw}`;
      const translated = t(key);
      if (translated && translated !== key) return translated;
      return raw;
    };
  }, [t]);

  const startEdit = (field: EditableFieldKey) => {
    if (!car) return;
    if (field === 'model_id' && !Number.isFinite(car.brand_id ?? NaN)) {
      setEditError('ابتدا برند را انتخاب کنید');
      return;
    }
    const current =
      field === 'brand_id'
        ? car.brand_id
        : field === 'model_id'
          ? car.model_id
          : field === 'trim_id'
            ? car.trim_id
            : field === 'make_year'
              ? car.make_year
              : field === 'mileage'
                ? car.mileage
                : car.color;
    setEditingField(field);
    setEditError('');
    setDraftValue(current === undefined || current === null ? '' : String(current));
  };

  const cancelEdit = () => {
    setEditingField(null);
    setDraftValue('');
    setEditError('');
  };

  const submitEdit = async () => {
    if (!car) return;
    if (!editingField) return;
    if (!Number.isFinite(adminId)) return;

    setEditError('');
    const raw = draftValue.trim();

    const numericKeys: EditableFieldKey[] = [
      'brand_id',
      'model_id',
      'trim_id',
      'make_year',
      'mileage',
    ];
    const isNumeric = numericKeys.includes(editingField);

    const body: Record<string, unknown> = { admin_id: adminId };

    if (isNumeric) {
      const normalized = toEnglishDigits(raw);
      const n = Number(normalized);
      if (!Number.isFinite(n)) {
        setEditError('مقدار عددی نامعتبر است');
        return;
      }
      body[editingField] = n;
    } else {
      if (!raw) {
        setEditError('مقدار نمی‌تواند خالی باشد');
        return;
      }
      body[editingField] = raw;
    }

    await patchCarMutation.mutateAsync({
      id: numericId,
      body: body as any,
    });

    await queryClient.invalidateQueries({ queryKey: ['cars', 'list'] });
    cancelEdit();
  };

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
            <Badge variant='light'>{car.status ? t(`status.${car.status}`) : ''}</Badge>
          </Group>
          <Text fw={800} size='lg'>
            {car.code}
          </Text>
          <Text size='sm' c='dimmed'>
            {car.city?.name} • {formatDateTime(car.created_at)}
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
                <Group gap={6} wrap='wrap' justify='flex-end'>
                  <Badge variant='outline'>{car.channel}</Badge>
                  {(car.badges ?? []).map((b) => (
                    <Badge key={b} variant='light' color='gray'>
                      {badgeLabel(b)}
                    </Badge>
                  ))}
                </Group>
              </Group>
              <Divider my='md' />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='sm'>
                <Group justify='space-between' align='flex-start'>
                  <Text c='dimmed' size='sm'>
                    برند
                  </Text>
                  {editingField === 'brand_id' ? (
                    <Stack gap={4} align='flex-end'>
                      <Group gap='xs' wrap='nowrap'>
                        <Select
                          value={draftValue || null}
                          onChange={(value) => setDraftValue(value ?? '')}
                          data={brandOptions}
                          searchable
                          placeholder='انتخاب برند'
                          nothingFoundMessage='موردی یافت نشد'
                          size='xs'
                          w={220}
                          disabled={brandsQuery.isLoading}
                        />
                        <ActionIcon
                          color='green'
                          variant='light'
                          onClick={submitEdit}
                          loading={patchCarMutation.isPending}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon color='red' variant='light' onClick={cancelEdit}>
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                      {brandsQuery.isLoading ? (
                        <Text c='dimmed' size='xs'>
                          در حال بارگذاری...
                        </Text>
                      ) : null}
                      {editError ? (
                        <Text c='red' size='xs'>
                          {editError}
                        </Text>
                      ) : null}
                    </Stack>
                  ) : (
                    <Group gap={6} wrap='nowrap'>
                      <Text fw={600} size='sm'>
                        {car.brand?.name_fa ?? '---'}
                        {car.brand_id ? ` (${toPersianDigits(String(car.brand_id))})` : ''}
                      </Text>
                      <ActionIcon
                        variant='subtle'
                        onClick={() => startEdit('brand_id')}
                        disabled={!Number.isFinite(adminId)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Group>
                  )}
                </Group>

                <Group justify='space-between' align='flex-start'>
                  <Text c='dimmed' size='sm'>
                    مدل
                  </Text>
                  {editingField === 'model_id' ? (
                    <Stack gap={4} align='flex-end'>
                      <Group gap='xs' wrap='nowrap'>
                        <Select
                          value={draftValue || null}
                          onChange={(value) => setDraftValue(value ?? '')}
                          data={modelOptions}
                          searchable
                          placeholder={
                            Number.isFinite(car.brand_id ?? NaN)
                              ? 'انتخاب مدل'
                              : 'ابتدا برند را انتخاب کنید'
                          }
                          nothingFoundMessage='موردی یافت نشد'
                          size='xs'
                          w={220}
                          disabled={!Number.isFinite(car.brand_id ?? NaN) || modelsQuery.isLoading}
                        />
                        <ActionIcon
                          color='green'
                          variant='light'
                          onClick={submitEdit}
                          loading={patchCarMutation.isPending}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon color='red' variant='light' onClick={cancelEdit}>
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                      {modelsQuery.isLoading ? (
                        <Text c='dimmed' size='xs'>
                          در حال بارگذاری...
                        </Text>
                      ) : null}
                      {editError ? (
                        <Text c='red' size='xs'>
                          {editError}
                        </Text>
                      ) : null}
                    </Stack>
                  ) : (
                    <Group gap={6} wrap='nowrap'>
                      <Text fw={600} size='sm'>
                        {car.model?.name_fa ?? '---'}
                        {car.model_id ? ` (${toPersianDigits(String(car.model_id))})` : ''}
                      </Text>
                      <ActionIcon
                        variant='subtle'
                        onClick={() => startEdit('model_id')}
                        disabled={!Number.isFinite(adminId)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Group>
                  )}
                </Group>

                <Group justify='space-between' align='flex-start'>
                  <Text c='dimmed' size='sm'>
                    تریم
                  </Text>
                  {editingField === 'trim_id' ? (
                    <Stack gap={4} align='flex-end'>
                      <Group gap='xs' wrap='nowrap'>
                        <TextInput
                          value={draftValue}
                          onChange={(e) => setDraftValue(toEnglishDigits(e.currentTarget.value))}
                          size='xs'
                          w={140}
                          inputMode='numeric'
                        />
                        <ActionIcon
                          color='green'
                          variant='light'
                          onClick={submitEdit}
                          loading={patchCarMutation.isPending}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon color='red' variant='light' onClick={cancelEdit}>
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                      {editError ? (
                        <Text c='red' size='xs'>
                          {editError}
                        </Text>
                      ) : null}
                    </Stack>
                  ) : (
                    <Group gap={6} wrap='nowrap'>
                      <Text fw={600} size='sm'>
                        {car.trim?.name_fa ?? '---'}
                        {car.trim_id ? ` (${toPersianDigits(String(car.trim_id))})` : ''}
                      </Text>
                      <ActionIcon
                        variant='subtle'
                        onClick={() => startEdit('trim_id')}
                        disabled={!Number.isFinite(adminId)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Group>
                  )}
                </Group>

                <Group justify='space-between' align='flex-start'>
                  <Text c='dimmed' size='sm'>
                    سال ساخت
                  </Text>
                  {editingField === 'make_year' ? (
                    <Stack gap={4} align='flex-end'>
                      <Group gap='xs' wrap='nowrap'>
                        <TextInput
                          value={draftValue}
                          onChange={(e) => setDraftValue(toEnglishDigits(e.currentTarget.value))}
                          size='xs'
                          w={140}
                          inputMode='numeric'
                        />
                        <ActionIcon
                          color='green'
                          variant='light'
                          onClick={submitEdit}
                          loading={patchCarMutation.isPending}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon color='red' variant='light' onClick={cancelEdit}>
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                      {editError ? (
                        <Text c='red' size='xs'>
                          {editError}
                        </Text>
                      ) : null}
                    </Stack>
                  ) : (
                    <Group gap={6} wrap='nowrap'>
                      <Text fw={600} size='sm'>
                        {car.make_year ? toPersianDigits(String(car.make_year)) : '---'}
                      </Text>
                      <ActionIcon
                        variant='subtle'
                        onClick={() => startEdit('make_year')}
                        disabled={!Number.isFinite(adminId)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Group>
                  )}
                </Group>

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
                <Group justify='space-between' align='flex-start'>
                  <Text c='dimmed' size='sm'>
                    رنگ
                  </Text>
                  {editingField === 'color' ? (
                    <Stack gap={4} align='flex-end'>
                      <Group gap='xs' wrap='nowrap'>
                        <TextInput
                          value={draftValue}
                          onChange={(e) => setDraftValue(e.currentTarget.value)}
                          size='xs'
                          w={140}
                        />
                        <ActionIcon
                          color='green'
                          variant='light'
                          onClick={submitEdit}
                          loading={patchCarMutation.isPending}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon color='red' variant='light' onClick={cancelEdit}>
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                      {editError ? (
                        <Text c='red' size='xs'>
                          {editError}
                        </Text>
                      ) : null}
                    </Stack>
                  ) : (
                    <Group gap={6} wrap='nowrap'>
                      <Text fw={600} size='sm'>
                        {car.color ?? '---'}
                      </Text>
                      <ActionIcon
                        variant='subtle'
                        onClick={() => startEdit('color')}
                        disabled={!Number.isFinite(adminId)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Group>
                  )}
                </Group>

                <Group justify='space-between' align='flex-start'>
                  <Text c='dimmed' size='sm'>
                    کارکرد
                  </Text>
                  {editingField === 'mileage' ? (
                    <Stack gap={4} align='flex-end'>
                      <Group gap='xs' wrap='nowrap'>
                        <TextInput
                          value={draftValue}
                          onChange={(e) => setDraftValue(toEnglishDigits(e.currentTarget.value))}
                          size='xs'
                          w={140}
                          inputMode='numeric'
                        />
                        <ActionIcon
                          color='green'
                          variant='light'
                          onClick={submitEdit}
                          loading={patchCarMutation.isPending}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon color='red' variant='light' onClick={cancelEdit}>
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                      {editError ? (
                        <Text c='red' size='xs'>
                          {editError}
                        </Text>
                      ) : null}
                    </Stack>
                  ) : (
                    <Group gap={6} wrap='nowrap'>
                      <Text fw={600} size='sm'>
                        {Number(car.mileage ?? 0).toLocaleString('fa-IR')} کیلومتر
                      </Text>
                      <ActionIcon
                        variant='subtle'
                        onClick={() => startEdit('mileage')}
                        disabled={!Number.isFinite(adminId)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Group>
                  )}
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
              <Text fw={700}>قیمت</Text>
              <Divider my='md' />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='sm'>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    قیمت نهایی
                  </Text>
                  <Text fw={700} size='sm'>
                    {formatPriceValue(car.price_record?.final)}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    قیمت نهایی مشتری
                  </Text>
                  <Text fw={700} size='sm'>
                    {formatPriceValue(car.price_record?.final_customer)}
                  </Text>
                </Group>

                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    برآورد
                  </Text>
                  <Text fw={600} size='sm'>
                    {formatPriceValue(car.price_record?.estimated)}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    برآورد بازار
                  </Text>
                  <Text fw={600} size='sm'>
                    {formatPriceValue(car.price_record?.estimated_in_market)}
                  </Text>
                </Group>

                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    پیشنهاد کاربر
                  </Text>
                  <Text fw={600} size='sm'>
                    {formatPriceValue(car.price_record?.user_suggest)}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    درآمد
                  </Text>
                  <Text fw={600} size='sm'>
                    {formatPriceValue(car.price_record?.revenue)}
                  </Text>
                </Group>

                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    پیشنهاد پایین
                  </Text>
                  <Text fw={700} size='sm' c='green'>
                    {formatPriceValue(car.price_record?.lower_suggest)}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    پیشنهاد بالا
                  </Text>
                  <Text fw={700} size='sm' c='red'>
                    {formatPriceValue(car.price_record?.upper_suggest)}
                  </Text>
                </Group>

                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    پیشنهاد فروش خسروانی
                  </Text>
                  <Text fw={700} size='sm' c='red'>
                    {formatPriceValue(car.price_record?.kh_suggest_for_sell)}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    پیشنهاد خرید خسروانی
                  </Text>
                  <Text fw={700} size='sm' c='green'>
                    {formatPriceValue(car.price_record?.kh_suggest_for_buy)}
                  </Text>
                </Group>

                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    پیشنهاد کارشناس فروش (پایین)
                  </Text>
                  <Text fw={700} size='sm' c='green'>
                    {formatPriceValue(car.price_record?.sales_person_lower)}
                  </Text>
                </Group>
                <Group justify='space-between'>
                  <Text c='dimmed' size='sm'>
                    پیشنهاد کارشناس فروش (بالا)
                  </Text>
                  <Text fw={700} size='sm' c='red'>
                    {formatPriceValue(car.price_record?.sales_person_upper)}
                  </Text>
                </Group>
              </SimpleGrid>
            </Card>

            <BookingInspectionSection carId={numericId} userId={Number(car.user_id ?? NaN)} />

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
                  notesItems.map((note) => <NoteCard key={note.id} note={note} />)
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
