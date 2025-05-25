import { Box, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  ClientResponse,
  ProductPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { getProducts } from '../services';
import { getProductList } from '../components/getProductList.tsx';
import UserStatus from '../components/UserStatus.tsx';
import HeroSection from '../components/MainPage/HeroSection.tsx';
import CTASection from '../components/MainPage/CTASection.tsx';

const INITIAL_DATA_PRODUCTS: ProductPagedQueryResponse = {
  limit: 0,
  offset: 0,
  count: 0,
  results: [],
};

const MainPage = () => {
  const bgProductCard = useColorModeValue('gray.50', 'gray.700');
  const [dataProducts, setDataProducts] = useState(INITIAL_DATA_PRODUCTS);

  useEffect(() => {
    getProducts()
      .then((data: ClientResponse<ProductPagedQueryResponse>) => {
        setDataProducts({ ...data.body });
      })
      .catch(console.error);
  }, []);

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <UserStatus />
      {getProductList(dataProducts, bgProductCard)}
      <HeroSection />
      <CTASection />
    </Box>
  );
};

export default MainPage;
