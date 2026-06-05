import { useMemo, useState } from 'react';
import { Button, Group } from '@mantine/core';
import type { CarsStatus } from '@/constants/Car.status';
import { ADMIN_APPROVED, CC_REJECTED, FOLLOW_UP, WAITING } from '@/constants/Car.status';
import { AUTH_DATA_STORAGE_KEY } from '@/constants/app.constant';
import { useQueryClient } from '@tanstack/react-query';
import { usePatchCarMutation } from '@/features/supply/api/patchCar';
import { openConfirmActionModal } from '@/components/shared/ConfirmActionModal';

export type CarManagementAction = 'approve' | 'reject' | 'follow_up';

type CarManagementCardActionsProps = {
  status: CarsStatus;
  carId?: number;
  onAction?: (action: CarManagementAction) => void;
};

export default function CarManagementCardActions({
  status,
  carId,
  onAction,
}: CarManagementCardActionsProps) {
  const queryClient = useQueryClient();
  const patchCarMutation = usePatchCarMutation();
  const [pendingAction, setPendingAction] = useState<CarManagementAction | null>(null);

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

  const actions =
    status === WAITING
      ? ([
          { id: 'approve', label: 'تایید', color: 'green', variant: 'light' },
          { id: 'reject', label: 'رد', color: 'red', variant: 'light' },
          { id: 'follow_up', label: 'پیگیری مجدد', color: 'yellow', variant: 'light' },
        ] as const)
      : [];

  if (actions.length === 0) return null;

  return (
    <Group justify='flex-end' gap='xs' wrap='wrap'>
      {actions.map((action) => (
        <Button
          key={action.id}
          size='xs'
          color={action.color}
          variant={action.variant}
          loading={pendingAction === action.id}
          disabled={patchCarMutation.isPending && pendingAction !== action.id}
          onClick={(e) => {
            e.stopPropagation();
            if (status !== WAITING) return;
            if (typeof carId !== 'number' || !Number.isFinite(carId)) return;
            if (!Number.isFinite(adminId)) return;

            const mappedStatus =
              action.id === 'approve'
                ? ADMIN_APPROVED
                : action.id === 'reject'
                  ? CC_REJECTED
                  : FOLLOW_UP;

            openConfirmActionModal({
              actionLabel: action.label,
              onConfirm: () => {
                onAction?.(action.id);
                setPendingAction(action.id);
                return patchCarMutation
                  .mutateAsync({
                    id: carId,
                    body: {
                      admin_id: adminId,
                      status: mappedStatus,
                    },
                  })
                  .then(() => queryClient.invalidateQueries({ queryKey: ['cars', 'list'] }))
                  .finally(() => setPendingAction(null));
              },
            });
          }}
        >
          {action.label}
        </Button>
      ))}
    </Group>
  );
}
