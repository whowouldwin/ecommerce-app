import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  IconButton,
  Box,
  VStack,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../features/user/userSlice';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  showAuthButtons?: boolean;
}

const BurgerMenu = ({
  isOpen,
  onClose,
  isLoggedIn,
  showAuthButtons,
}: BurgerMenuProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader display="flex" justifyContent="flex-start" p={2}>
          <IconButton
            aria-label="Close menu"
            icon={<CloseIcon />}
            variant="ghost"
            onClick={onClose}
          />
        </DrawerHeader>
        <DrawerBody>
          <Box mt={4}>
            <VStack spacing={4} align="stretch">
              <NavLinks onClick={onClose} />
            </VStack>
            <Box pt={4} borderTop="1px solid" borderColor="gray.200">
              <AuthButtons
                isLoggedIn={isLoggedIn}
                isVertical
                onClose={onClose}
                showAuthButtons={showAuthButtons}
                onLogout={() =>
                  dispatch(logoutUser())
                    .unwrap()
                    .then(() => navigate('/'))
                    .catch(console.error)
                }
              />
            </Box>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default BurgerMenu;
