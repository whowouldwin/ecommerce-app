import { Box, Container } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  showAuthButtons?: boolean;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh">
      <Header />
      <Container as="main" maxW="container.lg" py={6}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
