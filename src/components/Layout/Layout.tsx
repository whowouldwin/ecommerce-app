import { Box, Container } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import { selectIsCartUpdating } from '../../features/cart/cartSlice.ts';
import Loader from '../Loader.tsx';

interface LayoutProps {
  children: ReactNode;
  showAuthButtons?: boolean;
}

const Layout = ({ children }: LayoutProps) => {
  const isUpdating = useSelector(selectIsCartUpdating);
  return (
    <Box minH="100vh">
      <Header />
      <Container as="main" maxW="container.xl" py={6}>
        {children}
      </Container>
      {isUpdating && <Loader />}
    </Box>
  );
};

export default Layout;
