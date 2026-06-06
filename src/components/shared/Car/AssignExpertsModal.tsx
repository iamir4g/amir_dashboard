import { Button, Group, Modal, Select, Stack, Text } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { useState } from 'react';
import { SHOWED_UP } from '@/constants/Car.status';
import { useGetAllAdminsQuery } from '@/features/supply/api/getAllAdmins';
import { usePatchCarMutation } from '@/features/supply/api/patchCar';
import { usePostOperatorsMutation } from '@/features/supply/api/postOperators';
import type { Admin } from '@/types/Admin';

type AssignExpertsModalProps = {
  opened: boolean;
  onClose: () => void;
  carId: number;
  adminId: number;
  onSuccess?: () => void;
  onSubmittingChange?: (submitting: boolean) => void;
};

export default function AssignExpertsModal({
  opened,
  onClose,
  carId,
  adminId,
  onSuccess,
  onSubmittingChange,
}: AssignExpertsModalProps) {
  const queryClient = useQueryClient();
  const patchCarMutation = usePatchCarMutation();
  const postOperatorsMutation = usePostOperatorsMutation();
  const adminsQuery = useGetAllAdminsQuery();
  const admins = Array.isArray(adminsQuery.data) ? adminsQuery.data : [];

  const adminsOptions = admins.map((a: Admin) => {
    const fullName = `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim();
    const phone = a.phone ? ` - ${a.phone}` : '';
    const label = `${fullName || a.nickname || a.email || String(a.id)}${phone}`;
    return { value: String(a.id), label };
  });

  const schema = yup.object().shape({
    supply_expert: yup.string().nullable(),
    technical_expert: yup.string().required('انتخاب کارشناس فنی الزامی است'),
  });

  const form = useForm({
    initialValues: {
      supply_expert: '',
      technical_expert: '',
    },
    validate: yupResolver(schema),
  });

  const [error, setError] = useState('');

  const handleClose = () => {
    setError('');
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: { supply_expert: string; technical_expert: string }) => {
    setError('');
    onSubmittingChange?.(true);
    try {
      await postOperatorsMutation.mutateAsync({
        car_v2_id: carId,
        supply_expert: values.supply_expert ? Number(values.supply_expert) : undefined,
        technical_expert: Number(values.technical_expert),
      });

      await patchCarMutation.mutateAsync({
        id: carId,
        body: { admin_id: adminId, status: SHOWED_UP },
      });

      await queryClient.invalidateQueries({ queryKey: ['cars', 'list'] });
      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(String(err));
    } finally {
      onSubmittingChange?.(false);
    }
  };

  return (
    <Modal opened={opened} onClose={handleClose} title='انتخاب کارشناس‌ها' centered>
      <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap='sm'>
            {error ? (
              <Text c='red' size='sm'>
                {error}
              </Text>
            ) : null}

            <Select
              label='کارشناس تامین'
              placeholder='اختیاری'
              searchable
              clearable
              comboboxProps={{ withinPortal: false }}
              data={adminsOptions}
              value={form.values.supply_expert}
              onChange={(value) => form.setFieldValue('supply_expert', value ?? '')}
              disabled={adminsQuery.isLoading}
            />

            <Select
              label='کارشناس فنی'
              placeholder='انتخاب کارشناس فنی'
              withAsterisk
              searchable
              clearable
              comboboxProps={{ withinPortal: false }}
              data={adminsOptions}
              value={form.values.technical_expert}
              onChange={(value) => form.setFieldValue('technical_expert', value ?? '')}
              error={form.errors.technical_expert}
              disabled={adminsQuery.isLoading}
            />

            <Group justify='flex-end'>
              <Button variant='default' onClick={handleClose}>
                انصراف
              </Button>
              <Button
                type='submit'
                loading={postOperatorsMutation.isPending || patchCarMutation.isPending}
              >
                ثبت
              </Button>
            </Group>
          </Stack>
        </form>
      </div>
    </Modal>
  );
}
