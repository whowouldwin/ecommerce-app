import { Box, Container } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  showAuthButtons?: boolean;
}

const Layout = ({ children, showAuthButtons }: LayoutProps) => {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <Box minH="100vh">
      <Header isLoggedIn={isLoggedIn} showAuthButtons={showAuthButtons} />
      <Container as="main" maxW="container.lg" py={6}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
