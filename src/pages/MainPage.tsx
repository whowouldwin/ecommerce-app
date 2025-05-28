import { Box } from '@chakra-ui/react';
import UserStatus from '../components/UserStatus.tsx';
import HeroSection from '../components/MainPage/HeroSection.tsx';
import CTASection from '../components/MainPage/CTASection.tsx';
import ProductCategories from '../components/MainPage/ProductCategories.tsx';

const MainPage = () => {
  return (
    <Box p={6} maxW="7xl" mx="auto">
      <UserStatus />
      <HeroSection />
      <CTASection />
      <ProductCategories />
    </Box>
  );
};

export default MainPage;
