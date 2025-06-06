import { Button, VStack, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUser, logoutUser } from '../../features/user/userSlice';
import { resetCart } from '../../features/cart/cartSlice.ts';

interface AuthButtonsProps {
  isVertical?: boolean;
  onClose?: () => void;
  showAuthButtons?: boolean;
}

const AuthButtons = ({
  isVertical = false,
  onClose,
  showAuthButtons = true,
}: AuthButtonsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/');
        onClose?.();
        dispatch(resetCart());
      })
      .catch(console.error);
  };

  const Stack = isVertical ? VStack : HStack;

  if (user.isAuthenticated) {
    return (
      <Stack spacing={isVertical ? 3 : 2}>
        <Button
          colorScheme="red"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          width={isVertical ? '100%' : undefined}
        >
          Logout
        </Button>
      </Stack>
    );
  }

  if (!showAuthButtons) return null;

  return (
    <Stack spacing={isVertical ? 3 : 2}>
      <Button
        as={RouterLink}
        to="/login"
        colorScheme="brand"
        variant={location.pathname === '/login' ? 'solid' : 'outline'}
        size="sm"
        width={isVertical ? '100%' : undefined}
        onClick={onClose}
      >
        Login
      </Button>
      <Button
        as={RouterLink}
        to="/register"
        colorScheme="brand"
        variant={location.pathname === '/register' ? 'solid' : 'outline'}
        size="sm"
        width={isVertical ? '100%' : undefined}
        onClick={onClose}
      >
        Register
      </Button>
    </Stack>
  );
};

export default AuthButtons;
