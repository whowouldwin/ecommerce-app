import {
  Box,
  Flex,
  IconButton,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import ThemeToggle from '../ThemeToggle';
import NavLinks from './NavLinks';
import BurgerMenu from './BurgerMenu';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../features/user/userSlice';
import LogoBrand from './LogoBrand.tsx';
import AuthButtons from './AuthButtons.tsx';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isNarrow] = useMediaQuery('(max-width: 489px)');
  const bgHeader = useColorModeValue('white', 'gray.800');

  const user = useAppSelector(selectUser);

  return (
    <>
      <Box
        as="header"
        bg={bgHeader}
        boxShadow="sm"
        borderBottomRadius="md"
        py={6}
      >
        <Box maxW="7xl" px={6} mx="auto">
          <Flex align="center" justify="space-between" wrap="wrap">
            <Flex align="center">
              <IconButton
                icon={<HamburgerIcon />}
                variant="ghost"
                colorScheme="brand"
                aria-label="Open Menu"
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                mr={2}
              />
              <LogoBrand />
            </Flex>

            <Flex gap={6} align="center" display={{ base: 'none', md: 'flex' }}>
              <NavLinks />
            </Flex>

            <Flex align="center" gap={3} mt={{ base: 3, md: 0 }}>
              {!isNarrow && <AuthButtons />}
              <ThemeToggle />
            </Flex>
          </Flex>
        </Box>
      </Box>

      <BurgerMenu
        isOpen={isOpen}
        onClose={onClose}
        isLoggedIn={user.isAuthenticated}
        showAuthButtons={!user.isAuthenticated}
      />
    </>
  );
};

export default Header;
