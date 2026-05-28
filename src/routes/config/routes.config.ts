import { lazy } from 'react';
import authRoute from './authRoute';
import type { Routes } from '@/types/routes';

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes = [
  {
    key: 'dashboard',
    path: '/dashboard',
    component: lazy(() => import('@/pages/Dashboard')),
    authority: [],
  },
  {
    key: 'supply',
    path: '/supply',
    component: lazy(() => import('@/features/supply/pages/Supply')),
    authority: [],
  },
  {
    key: 'supplySalesRequests',
    path: '/supply/sales-requests',
    component: lazy(() => import('@/features/supply/pages/SalesRequests')),
    authority: [],
  },
  {
    key: 'supplyCenterReservations',
    path: '/supply/center-reservations',
    component: lazy(() => import('@/features/supply/pages/CenterReservations')),
    authority: [],
  },
  {
    key: 'supplyDocumentsChecklist',
    path: '/supply/documents-checklist',
    component: lazy(() => import('@/features/supply/pages/DocumentsChecklist')),
    authority: [],
  },
  {
    key: 'supplyPricing',
    path: '/supply/pricing',
    component: lazy(() => import('@/features/supply/pages/Pricing')),
    authority: [],
  },
  {
    key: 'supplyNegotiation',
    path: '/supply/negotiation',
    component: lazy(() => import('@/features/supply/pages/Negotiation')),
    authority: [],
  },
  {
    key: 'supplyContracts',
    path: '/supply/contracts',
    component: lazy(() => import('@/features/supply/pages/Contracts')),
    authority: [],
  },
  {
    key: 'supplyFailedContracts',
    path: '/supply/contracts-failed',
    component: lazy(() => import('@/features/supply/pages/FailedContracts')),
    authority: [],
  },
  {
    key: 'users',
    path: '/users',
    component: lazy(() => import('@/pages/Users')),
    authority: [],
  },
  {
    key: 'pages',
    path: '/dashboard/pages',
    component: lazy(() => import('@/pages/Pages')),
    authority: [],
  },
  {
    key: 'files',
    path: '/dashboard/files',
    component: lazy(() => import('@/pages/Files')),
    authority: [],
  },
  {
    key: 'manage',
    path: '/users/manage',
    component: lazy(() => import('@/pages/Manage')),
    authority: [],
  },
];
