import { render, screen, userEvent } from '@test-utils';
import { vi } from 'vitest';
import { CarManagementCard } from './CarManagementCard';
import { WAITING, SOLD } from '@/constants/Car.status';

describe('CarManagementCard', () => {
  it('renders waiting actions', () => {
    render(
      <CarManagementCard
        car={{
          id: 1,
          brand: { name_fa: 'تست' } as any,
          model: { name_fa: 'مدل' } as any,
          make_year: 1400,
          code: 'CAR-1',
          user: { first_name: 'مالک', last_name: 'تست', phone: '09120000000' } as any,
          price_record: { final: '100' } as any,
        }}
        status={WAITING}
        statuses={[{ label: WAITING, color: 'blue' }]}
      />
    );

    expect(screen.getByRole('button', { name: 'تایید' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'رد' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'پیگیری مجدد' })).toBeInTheDocument();
  });

  it('does not render actions for non-waiting status', () => {
    render(
      <CarManagementCard
        car={{
          id: 1,
          brand: { name_fa: 'تست' } as any,
          model: { name_fa: 'مدل' } as any,
          make_year: 1400,
          code: 'CAR-1',
          user: { first_name: 'مالک', last_name: 'تست', phone: '09120000000' } as any,
        }}
        status={SOLD}
        statuses={[{ label: SOLD, color: 'green' }]}
      />
    );

    expect(screen.queryByRole('button', { name: 'تایید' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'رد' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'پیگیری مجدد' })).not.toBeInTheDocument();
  });

  it('does not trigger card click when clicking an action button', async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();

    render(
      <CarManagementCard
        car={{
          id: 1,
          brand: { name_fa: 'تست' } as any,
          model: { name_fa: 'مدل' } as any,
          make_year: 1400,
          code: 'CAR-1',
          user: { first_name: 'مالک', last_name: 'تست', phone: '09120000000' } as any,
        }}
        status={WAITING}
        statuses={[{ label: WAITING, color: 'blue' }]}
        onCardClick={onCardClick}
      />
    );

    await user.click(screen.getByRole('button', { name: 'تایید' }));

    expect(onCardClick).not.toHaveBeenCalled();
  });

  it('triggers card click when clicking card content', async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();

    render(
      <CarManagementCard
        car={{
          id: 1,
          brand: { name_fa: 'تست' } as any,
          model: { name_fa: 'مدل' } as any,
          make_year: 1400,
          code: 'CAR-1',
          user: { first_name: 'مالک', last_name: 'تست', phone: '09120000000' } as any,
        }}
        status={WAITING}
        statuses={[{ label: WAITING, color: 'blue' }]}
        onCardClick={onCardClick}
      />
    );

    await user.click(screen.getByText('تست مدل 1400'));
    expect(onCardClick).toHaveBeenCalledTimes(1);
  });
});
