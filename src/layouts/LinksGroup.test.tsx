import { render, screen } from '@test-utils';
import { vi } from 'vitest';
import { useAppStore } from '@/store';
import { IconDashboard } from '@tabler/icons-react';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

import { LinksGroup } from './LinksGroup';

describe('LinksGroup', () => {
  it('shows badge for sales requests link when count > 0', () => {
    useAppStore.setState((state) => ({
      ...state,
      base: {
        ...state.base,
        common: {
          ...state.base.common,
          salesRequestsWaitingCount: 12,
        },
      },
    }));

    render(
      <LinksGroup
        icon={IconDashboard as any}
        label='تامین'
        links={[
          { label: 'درخواست های فروش', link: '/supply/sales-requests' },
          { label: 'رزرو های سنتر', link: '/supply/center-reservations' },
        ]}
      />
    );

    expect(screen.getByText('12')).toBeInTheDocument();

    useAppStore.setState((state) => ({
      ...state,
      base: {
        ...state.base,
        common: {
          ...state.base.common,
          salesRequestsWaitingCount: 0,
        },
      },
    }));
  });
});
