import {
  Flex,
  IconButton,
  Box,
  Button,
  useDisclosure,
  useMediaQuery,
  Container,
  Spacer,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import Logo from './Logo';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import { usePreviousLocation } from '../../hooks/usePreviousLocation';
import BurgerMenu from './BurgerMenu';

const Header = ({
  isLoggedIn,
  showAuthButtons,
}: {
  isLoggedIn: boolean;
  showAuthButtons?: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isNarrow] = useMediaQuery('(max-width: 489px)');
  const location = useLocation();
  const { goBack } = usePreviousLocation();

  return (
    <>
      <Flex as="header" p={4} boxShadow="sm" borderBottomRadius="md">
        <Container maxW="container.lg" display="flex" alignItems="center">
          <Flex align="center">
            {!['/login', '/register'].includes(location.pathname) && (
              <IconButton
                icon={<HamburgerIcon />}
                variant="ghost"
                colorScheme="brand"
                aria-label="Open Menu"
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                mr={2}
              />
            )}
            <Logo />
            <Box
              lineHeight="short"
              color="primary"
              _dark={{ color: 'brand.300' }}
            >
              <Box fontWeight="bold">FLR</Box>
              <Box fontSize="sm" display={{ base: 'none', md: 'block' }}>
                Product Customers Pr
              </Box>
            </Box>
          </Flex>

          <Spacer />

          {!['/login', '/register'].includes(location.pathname) && (
            <Flex gap={6} align="center" display={{ base: 'none', md: 'flex' }}>
              <NavLinks />
            </Flex>
          )}

          <Spacer />

          <Flex align="center" gap={3}>
            {!isNarrow && (
              <AuthButtons
                isLoggedIn={isLoggedIn}
                showAuthButtons={showAuthButtons}
              />
            )}
            {['/login', '/register'].includes(location.pathname) && (
              <Button variant="outline" colorScheme="brand" onClick={goBack}>
                Back
              </Button>
            )}
            <ThemeToggle />
          </Flex>
        </Container>
      </Flex>

      <BurgerMenu
        isOpen={isOpen}
        onClose={onClose}
        isLoggedIn={isLoggedIn}
        showAuthButtons={showAuthButtons}
      />
    </>
  );
};

export default Header;
