import { VStack, Heading } from '@chakra-ui/react';
import { ProductPagedQueryResponse } from '@commercetools/platform-sdk';
import ProductCard from './ProductCard.tsx';

export const getProductList = (
  productData: ProductPagedQueryResponse,
  cardBg: string,
) => (
  <VStack spacing={6} align="stretch" mt={10}>
    <Heading size="md">Products ({productData.count})</Heading>

    {productData.results.map((product) => (
      <ProductCard key={product.id} product={product} bg={cardBg} />
    ))}
  </VStack>
);
