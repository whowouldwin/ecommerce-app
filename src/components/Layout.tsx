import {
  Box,
  Flex,
  Container,
  Spacer,
  Button,
  Link as ChakraLink,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { ReactNode, useRef, useEffect } from 'react';
import {
  useNavigate,
  useLocation,
  NavLink as RouterNavLink,
  matchPath,
} from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { usePreviousLocation } from '../hooks/usePreviousLocation';

interface LayoutProps {
  children: ReactNode;
  headerButtonText?: string;
  headerButtonLink?: string;
  showAuthButtons?: boolean;
}

const Layout = ({ children, showAuthButtons }: LayoutProps) => {
  const navigate = useNavigate();
  const logoFilter = useColorModeValue('invert(0)', 'invert(1)');
  const location = useLocation();
  const activeColor = useColorModeValue('secondary', 'brand.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.300');
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const { goBack } = usePreviousLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [isNarrow] = useMediaQuery('(max-width: 489px)');

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Delivery', to: '/delivery' },
  ];

  useEffect(() => {
    if (['/login', '/register'].includes(location.pathname)) {
      onClose();
    }
  }, [location.pathname, onClose]);

  return (
    <Box minH="100vh">
      <Flex as="header" p={4} boxShadow="sm" borderBottomRadius="md">
        <Container maxW="container.lg" display="flex" alignItems="center">
          {/* ЛОГО и Бургер Иконка */}
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
            <Box boxSize="40px" mr={3}>
              <img
                src="/favikon.svg"
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  filter: logoFilter,
                }}
              />
            </Box>
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

          {/* СЕРЕДИНА — Навигационные ссылки */}
          <Spacer />
          {!['/login', '/register'].includes(location.pathname) && (
            <Flex
              gap={6}
              align="center"
              display={{ base: 'none', md: 'flex' }} // скрывать на мобильных
            >
              {navLinks.map(({ label, to }) => {
                const match = matchPath(
                  { path: to, end: true },
                  location.pathname,
                );
                const isActive = Boolean(match);

                return (
                  <ChakraLink
                    as={RouterNavLink}
                    key={to}
                    to={to}
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? activeColor : inactiveColor}
                    _hover={{ textDecoration: 'none', color: activeColor }}
                    textDecoration="none"
                  >
                    {label}
                  </ChakraLink>
                );
              })}
            </Flex>
          )}

          {/* ПРАВО */}
          <Spacer />
          <Flex align="center" gap={3}>
            {!isNarrow && (
              <Flex gap={3}>
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    colorScheme="red"
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                  >
                    Log out
                  </Button>
                ) : (
                  showAuthButtons && (
                    <>
                      <Button
                        variant="outline"
                        colorScheme="brand"
                        onClick={() => navigate('/login')}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="solid"
                        colorScheme="brand"
                        onClick={() =>
                          navigate('/register', {
                            state: { from: location.pathname },
                          })
                        }
                      >
                        Sign Up
                      </Button>
                    </>
                  )
                )}
              </Flex>
            )}
            {location.pathname === '/register' && (
              <Button variant="outline" colorScheme="brand" onClick={goBack}>
                Back
              </Button>
            )}
            <ThemeToggle />
          </Flex>
        </Container>
      </Flex>

      {/* Drawer (бургер меню) */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
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
            <VStack spacing={4} align="stretch" mt={4}>
              {/* Навигация */}
              {navLinks.map(({ label, to }) => {
                const match = matchPath(
                  { path: to, end: true },
                  location.pathname,
                );
                const isActive = Boolean(match);

                return (
                  <Button
                    key={to}
                    variant="ghost"
                    justifyContent="flex-start"
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? activeColor : inactiveColor}
                    _hover={{ textDecoration: 'none', color: activeColor }}
                    onClick={() => {
                      navigate(to);
                      onClose();
                    }}
                  >
                    {label}
                  </Button>
                );
              })}

              <Box pt={4} borderTop="1px solid" borderColor="gray.200">
                {/* Правые кнопки */}
                {isNarrow && (
                  <VStack spacing={3} align="stretch" mt={4}>
                    {isLoggedIn ? (
                      <Button
                        variant="outline"
                        colorScheme="red"
                        w="full"
                        onClick={() => {
                          localStorage.removeItem('token');
                          navigate('/login');
                          onClose();
                        }}
                      >
                        Log out
                      </Button>
                    ) : (
                      showAuthButtons && (
                        <>
                          <Button
                            variant="outline"
                            colorScheme="brand"
                            w="full"
                            onClick={() => {
                              navigate('/login');
                              onClose();
                            }}
                          >
                            Sign In
                          </Button>
                          <Button
                            variant="solid"
                            colorScheme="brand"
                            w="full"
                            onClick={() => {
                              navigate('/register', {
                                state: { from: location.pathname },
                              });
                              onClose();
                            }}
                          >
                            Sign Up
                          </Button>
                        </>
                      )
                    )}
                  </VStack>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Container as="main" maxW="container.lg" py={6}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
