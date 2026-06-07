import { render, screen } from '@test-utils';
import NoteCard from './NoteCard';

describe('NoteCard', () => {
  it('renders note author full name and text', () => {
    render(
      <NoteCard
        note={{
          id: 1,
          admin_id: 1,
          car_v2_id: 78,
          text: 'یارو مالکش قفلیه!',
          created_at: '2026-06-07T09:39:17.455404Z',
          updated_at: '2026-06-07T09:39:17.455404Z',
          deleted_at: null,
          admin: { id: 1, first_name: 'Amir', last_name: 'Farahani' },
        }}
      />
    );

    expect(screen.getByText('Amir Farahani')).toBeInTheDocument();
    expect(screen.getByText('یارو مالکش قفلیه!')).toBeInTheDocument();
  });
});

