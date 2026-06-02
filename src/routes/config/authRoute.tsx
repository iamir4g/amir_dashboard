import { lazy } from 'react';
import type { Routes } from '@/types/routes';

const authRoute: Routes = [
  {
    key: 'signIn',
    path: `/sign-in`,
    component: lazy(() => import('@/pages/auth/SignIn')),
    authority: [],
  },
  {
    key: 'verifyOtp',
    path: `/verify-otp`,
    component: lazy(() => import('@/pages/auth/VerifyOtp')),
    authority: [],
  },
  // {
  //   key: 'signUp',
  //   path: `/sign-up`,
  //   component: lazy(() => import('@/views/auth/SignUp')),
  //   authority: []
  // },
];

export default authRoute;
