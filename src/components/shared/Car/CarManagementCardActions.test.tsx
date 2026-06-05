import { render, screen, userEvent, waitFor } from '@test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ADMIN_APPROVED, CC_REJECTED, FOLLOW_UP, WAITING } from '@/constants/Car.status';
import { AUTH_DATA_STORAGE_KEY } from '@/constants/app.constant';

const mutateAsyncMock = vi.fn();
const openConfirmActionModalMock = vi.fn();

vi.mock('@/features/supply/api/patchCar', () => ({
  usePatchCarMutation: () => ({
    isPending: false,
    mutateAsync: mutateAsyncMock,
  }),
}));

vi.mock('@/components/shared/ConfirmActionModal', () => ({
  openConfirmActionModal: (params: { actionLabel: string; onConfirm: () => void }) => {
    openConfirmActionModalMock(params);
    params.onConfirm();
  },
}));

import CarManagementCardActions from './CarManagementCardActions';

describe('CarManagementCardActions', () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset().mockResolvedValue(undefined);
    openConfirmActionModalMock.mockReset();
    localStorage.setItem(
      AUTH_DATA_STORAGE_KEY,
      JSON.stringify({
        access_token: 'token',
        refresh_token: 'refresh',
        user_info: { id: 407 },
      })
    );
  });

  it('patches status to ADMIN_APPROVED on approve', async () => {
    const user = userEvent.setup();
    render(<CarManagementCardActions status={WAITING} carId={10} />);

    await user.click(screen.getByRole('button', { name: 'تایید' }));

    expect(openConfirmActionModalMock).toHaveBeenCalledWith(
      expect.objectContaining({ actionLabel: 'تایید' })
    );

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        id: 10,
        body: { admin_id: 407, status: ADMIN_APPROVED },
      })
    );
  });

  it('patches status to CC_REJECTED on reject', async () => {
    const user = userEvent.setup();
    render(<CarManagementCardActions status={WAITING} carId={10} />);

    await user.click(screen.getByRole('button', { name: 'رد' }));

    expect(openConfirmActionModalMock).toHaveBeenCalledWith(
      expect.objectContaining({ actionLabel: 'رد' })
    );

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        id: 10,
        body: { admin_id: 407, status: CC_REJECTED },
      })
    );
  });

  it('patches status to FOLLOW_UP on follow_up', async () => {
    const user = userEvent.setup();
    render(<CarManagementCardActions status={WAITING} carId={10} />);

    await user.click(screen.getByRole('button', { name: 'پیگیری مجدد' }));

    expect(openConfirmActionModalMock).toHaveBeenCalledWith(
      expect.objectContaining({ actionLabel: 'پیگیری مجدد' })
    );

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        id: 10,
        body: { admin_id: 407, status: FOLLOW_UP },
      })
    );
  });
});
