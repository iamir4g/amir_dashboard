import { Navigate, Outlet } from 'react-router-dom';
import appConfig from '@/configs/app.config';
import useAuth from '@/features/auth/hooks/useAuth';

const { authenticatedEntryPath } = appConfig;

const PublicRoute = () => {
  const { authenticated } = useAuth();

  return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />;
};

export default PublicRoute;
