import type { NavigationTree } from '@/types/navigation';
import { IconDashboard, IconUser } from '@tabler/icons-react';

const navigationConfig: NavigationTree[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    translateKey: 'nav.dashboard',
    icon: IconDashboard,
    authority: [],
    subMenu: [],
  },
  {
    key: 'supply',
    path: '/supply',
    title: 'تامین',
    translateKey: '',
    icon: IconDashboard,
    authority: [],
    subMenu: [
      {
        key: 'supplySalesRequests',
        path: '/supply/sales-requests',
        title: 'درخواست های فروش',
        translateKey: '',
        authority: [],
      },
      {
        key: 'supplyCenterReservations',
        path: '/supply/center-reservations',
        title: 'رزرو های سنتر',
        translateKey: '',
        authority: [],
      },
      {
        key: 'supplyDocumentsChecklist',
        path: '/supply/documents-checklist',
        title: 'چک لیست مدارک',
        translateKey: '',
        authority: [],
      },
      {
        key: 'supplyPricing',
        path: '/supply/pricing',
        title: 'قیمت گذاری',
        translateKey: '',
        authority: [],
      },
      {
        key: 'supplyNegotiation',
        path: '/supply/negotiation',
        title: 'در حال مذاکره',
        translateKey: '',
        authority: [],
      },
      {
        key: 'supplyContracts',
        path: '/supply/contracts',
        title: 'قرارداد تامین',
        translateKey: '',
        authority: [],
      },
      {
        key: 'supplyFailedContracts',
        path: '/supply/contracts-failed',
        title: 'قرارداد تامین ناموفق',
        translateKey: '',
        authority: [],
      },
    ],
  },
  {
    key: 'users',
    path: '/users',
    title: 'Users',
    translateKey: 'nav.users',
    icon: IconUser,
    authority: [],
    subMenu: [],
  },
];

export default navigationConfig;
