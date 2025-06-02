import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';
import { useAppSelector } from '../store/hooks.ts';
import { selectUser } from '../features/user/userSlice.ts';
import { RequestStatus } from '../enums/appEnums';

interface ProtectedRouteProps {
  children: React.ReactNode;
  authenticationRequired?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  authenticationRequired = true,
}) => {
  const { isAuthenticated, status } = useAppSelector(selectUser);
  const location = useLocation();

  if (status === RequestStatus.LOADING && authenticationRequired) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

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
