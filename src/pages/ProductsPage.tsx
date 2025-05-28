import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Flex,
  Button,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { getLocalizedText } from '../utils/localization.ts';
import { fetchProducts } from '../features/product/productSlice.ts';
import { fetchCategories } from '../features/category/categorySlice.ts';
import { AppDispatch, RootState } from '../store/store.ts';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ProductsPage = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const dispatch = useDispatch<AppDispatch>();
  const query = useQuery();
  const selectedCategoryKey = query.get('category');

  const { products, loading, error } = useSelector(
    (state: RootState) => state.product,
  );
  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const getCategoryKeyById = (id: string) =>
    categories.find((cat) => cat.id === id)?.key;

  const filteredProducts = selectedCategoryKey
    ? products.filter((product) =>
        product.categories?.some(
          (ref) => getCategoryKeyById(ref.id) === selectedCategoryKey,
        ),
      )
    : products;

  if (loading) {
    return <Text px={4}>Loading products...</Text>;
  }

  if (error) {
    return (
      <Text px={4} color="red.500">
        Error loading products: {error}
      </Text>
    );
  }

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={10}>
      <Heading mb={6} color={headingColor}>
        {selectedCategoryKey
          ? `Products in "${selectedCategoryKey}"`
          : 'All Products'}
      </Heading>

      {filteredProducts.length === 0 ? (
        <Text>No products found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {filteredProducts.map((product) => {
            const imageUrl =
              product.masterVariant?.images?.[0]?.url ||
              product.variants?.[0]?.images?.[0]?.url ||
              '/placeholder.png';
            const price =
              product.masterVariant?.prices?.[0]?.value?.centAmount ?? 0;
            const currency =
              product.masterVariant?.prices?.[0]?.value?.currencyCode ?? 'USD';

            return (
              <Box
                key={product.id}
                borderRadius="xl"
                boxShadow="md"
                overflow="hidden"
                bg={cardBg}
              >
                <Image
                  src={imageUrl}
                  alt={getLocalizedText(product.name)}
                  w="100%"
                  h="auto"
                  objectFit="cover"
                />

                <Box p={4} textAlign="center">
                  <Text fontWeight="bold" fontSize="md" mb={1}>
                    {getLocalizedText(product.name)}
                  </Text>
                  <Text fontSize="sm" mb={2} color={textColor}>
                    {getLocalizedText(product.description)}
                  </Text>

                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                    mb={4}
                  >
                    <Text fontWeight="bold" color="green.500">
                      ${(price / 100).toFixed(2)} {currency}
                    </Text>
                  </Box>

                  <Flex justify="center" gap={3}>
                    <Button variant="outline" borderColor="gray.300">
                      View details
                    </Button>
                    <Button colorScheme="green">Add to Cart</Button>
                  </Flex>
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ProductsPage;
