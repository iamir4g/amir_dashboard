import React, { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
// import useAuth from '@/features/auth/hooks/useAuth';
import useLocale from '@/utils/hooks/useLocale';
import LoadingScreen from '@/components/shared/LoadingScreen/LoadingScreen';
import { LayoutTypes } from '@/types/layout';
import { setSalesRequestsWaitingCount, useAppSelector } from '@/store';
import useAuth from '@/features/auth/hooks/useAuth';
// import useAuth from '@/features/auth/hooks/useAuth';
import { getCarsTotalItems } from '@/features/supply/api/getCars';
import { WAITING } from '@/constants/Car.status';

const layouts: any = {
  // LEGACY
  [LayoutTypes.SimpleSideBar]: lazy(() => import('./LayoutTypes/SimpleSideBar')),
  [LayoutTypes.DeckedSideBar]: lazy(() => import('./LayoutTypes/DeckedSideBar')),
  [LayoutTypes.CollapsedSideBar]: lazy(() => import('./LayoutTypes/CollapsedSideBar')),
  // NEW
  [LayoutTypes.CollapsibleAppShell]: lazy(() => import('./LayoutTypes/CollapsibleAppShell')),
  [LayoutTypes.Plain]: lazy(() => import('./LayoutTypes/PlainLayout')),
};

export function Layout() {
  const { authenticated } = useAuth();
  const layoutType = useAppSelector((state) => state.theme.currentLayout);
  const token = useAppSelector((state) => state.auth.session.token);
  const lastFetchedTokenRef = useRef<string | null>(null);

  useLocale();

  useEffect(() => {
    if (!authenticated || !token) {
      lastFetchedTokenRef.current = null;
      setSalesRequestsWaitingCount(0);
      return;
    }

    if (lastFetchedTokenRef.current === token) return;
    lastFetchedTokenRef.current = token;

    getCarsTotalItems({ status: WAITING, page: 1, page_size: 1 })
      .then((count) => {
        setSalesRequestsWaitingCount(count);
      })
      .catch(() => {
        setSalesRequestsWaitingCount(0);
      });
  }, [authenticated, token]);

  const AppLayout = useMemo(() => {
    if (authenticated) {
      return layouts[layoutType];
    }
    return lazy(() => import('./AuthLayout'));
  }, [authenticated]);

  return (
    <Suspense
      fallback={
        <div className='flex flex-auto flex-col h-[100vh]'>
          <LoadingScreen />
        </div>
      }
    >
      <AppLayout />
    </Suspense>
  );
}
