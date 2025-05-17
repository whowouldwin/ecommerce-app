import {
  Flex,
  IconButton,
  Box,
  Button,
  useDisclosure,
  useMediaQuery,
  Container,
  Spacer,
  Link as ChakraLink,
  Image,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import NavLinks from './NavLinks';
import BurgerMenu from './BurgerMenu';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectUser, logoutUser } from '../../features/user/userSlice';
import logo from '../../assets/logo.svg';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isNarrow] = useMediaQuery('(max-width: 489px)');
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate('/'))
      .catch(console.error);
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <Flex as="header" p={4} boxShadow="sm" borderBottomRadius="md" bg="white">
        <Container maxW="container.lg" display="flex" alignItems="center">
          <Flex align="center">
            {!isAuthPage && (
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

            <ChakraLink
              as={RouterLink}
              to="/"
              _hover={{ textDecoration: 'none' }}
            >
              <Flex align="center" gap={3}>
                <Image src={logo} alt="Logo" height="40px" className="logo" />
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
            </ChakraLink>
          </Flex>

          <Spacer />

          {!isAuthPage && (
            <Flex gap={6} align="center" display={{ base: 'none', md: 'flex' }}>
              <NavLinks />
            </Flex>
          )}

          <Spacer />

          <Flex align="center" gap={3}>
            {!isNarrow && (
              <>
                {user.isAuthenticated ? (
                  <Button colorScheme="red" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      as={RouterLink}
                      to="/login"
                      colorScheme="teal"
                      variant={
                        location.pathname === '/login' ? 'solid' : 'outline'
                      }
                      size="sm"
                    >
                      Login
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/register"
                      colorScheme="teal"
                      variant={
                        location.pathname === '/register' ? 'solid' : 'outline'
                      }
                      size="sm"
                    >
                      Register
                    </Button>
                  </>
                )}
              </>
            )}

            {isAuthPage && (
              <Button
                variant="outline"
                colorScheme="brand"
                onClick={() => navigate(-1)}
              >
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
        isLoggedIn={user.isAuthenticated}
        showAuthButtons={!user.isAuthenticated}
      />
    </>
  );
};

export default Header;
