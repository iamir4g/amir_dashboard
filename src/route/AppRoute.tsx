import { useEffect, useCallback } from 'react';
import { setCurrentRouteKey } from '@/store';
import { useLocation } from 'react-router-dom';
import type { ComponentType } from 'react';

export type AppRouteProps<T> = {
  component: ComponentType<T>;
  routeKey: string;
};

const AppRoute = <T extends Record<string, unknown>>({
  component: Component,
  routeKey,
  ...props
}: AppRouteProps<T>) => {
  const location = useLocation();

  const handleLayoutChange = useCallback(() => {
    setCurrentRouteKey(routeKey);
  }, [routeKey]);

  useEffect(() => {
    handleLayoutChange();
  }, [location, handleLayoutChange]);

  return <Component {...(props as T)} />;
};

export default AppRoute;
