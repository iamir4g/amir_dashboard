import { render, screen, userEvent } from '@test-utils';
import { vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../api/getBookinspectionByDate', () => ({
  useGetBookInspectionByDateQuery: () => ({
    isLoading: false,
    data: {
      '1405-03-17': [
        {
          id: 1,
          car: {
            id: 69,
            brand: { name_fa: 'تست' },
            model: { name_fa: 'مدل' },
            make_year: 1400,
            mileage: 1000,
            color: 'navy-blue',
            code: '800838',
            status: 'INSPECTION_BOOKED',
            user: { first_name: 'امیر', last_name: 'سالاری', phone: '0912' },
            price_record: { final: '100' },
          },
        },
      ],
      '1405-03-18': [],
    },
  }),
}));

import CenterReservations from './CenterReservations';

describe('CenterReservations', () => {
  it('renders dates in accordion and shows cars when expanded', async () => {
    const user = userEvent.setup();
    render(<CenterReservations />);

    expect(screen.getByText('رزرو های سنتر')).toBeInTheDocument();
    expect(screen.getAllByText('1 مورد').length).toBeGreaterThan(0);

    expect(screen.getByText('1405-03-17')).toBeInTheDocument();
    expect(screen.getByText('1405-03-18')).toBeInTheDocument();

    await user.click(screen.getByText('1405-03-17'));
    expect(screen.getByText('تست مدل 1400')).toBeInTheDocument();
  });
});
