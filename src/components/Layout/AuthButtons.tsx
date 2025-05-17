import { Button, VStack } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthButtonsProps {
  isLoggedIn: boolean;
  isVertical?: boolean;
  onClose?: () => void;
  showAuthButtons?: boolean;
}

const AuthButtons = ({
  isLoggedIn,
  isVertical = false,
  onClose,
  showAuthButtons,
}: AuthButtonsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    onClose?.();
  };

  const onLogin = () => {
    navigate('/login');
    onClose?.();
  };

  const onRegister = () => {
    navigate('/register', { state: { from: location.pathname } });
    onClose?.();
  };

  if (isLoggedIn) {
    return (
      <Button
        variant="outline"
        colorScheme="red"
        w={isVertical ? 'full' : undefined}
        onClick={onLogout}
      >
        Log out
      </Button>
    );
  }

  if (!showAuthButtons) return null;

  const buttons = (
    <>
      <Button
        variant="outline"
        colorScheme="brand"
        w={isVertical ? 'full' : undefined}
        onClick={onLogin}
      >
        Sign In
      </Button>
      <Button
        variant="solid"
        colorScheme="brand"
        w={isVertical ? 'full' : undefined}
        onClick={onRegister}
      >
        Sign Up
      </Button>
    </>
  );

  return isVertical ? <VStack spacing={3}>{buttons}</VStack> : <>{buttons}</>;
};

export default AuthButtons;
