import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';

type ConfirmActionModalParams = {
  actionLabel: string;
  onConfirm: () => void | Promise<void>;
};

export const openConfirmActionModal = ({ actionLabel, onConfirm }: ConfirmActionModalParams) => {
  modals.openConfirmModal({
    title: 'تایید عملیات',
    children: <Text size='sm'>آیا از انجام عملیات «{actionLabel}» مطمئنید؟</Text>,
    labels: { confirm: 'بله', cancel: 'خیر' },
    onConfirm,
  });
};

