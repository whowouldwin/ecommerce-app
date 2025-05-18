import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks.ts';
import { selectUser } from '../features/user/userSlice.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
  authenticationRequired?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  authenticationRequired = true,
}) => {
  const { isAuthenticated } = useAppSelector(selectUser);
  const location = useLocation();

  if (!authenticationRequired && isAuthenticated) {
    return (
      <Navigate to="/" replace state={{ from: location.state?.from || '/' }} />
    );
  }
  if (authenticationRequired && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
