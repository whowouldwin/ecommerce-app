import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { fetchProducts } from '../features/product/productSlice.ts';
import { fetchCategories } from '../features/category/categorySlice.ts';
import { AppDispatch, RootState } from '../store/store.ts';
import ProductCard from '../components/ProductCard.tsx';

const ProductsPage = () => {
  const headingColor = useColorModeValue('gray.900', 'white');
  const selectedCategoryKey = useSelector(
    (state: RootState) => state.category.selectedCategoryKey,
  );
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.product,
  );
  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, products.length, categories.length]);

  const getCategoryKeyById = (id: string) =>
    categories.find((cat) => cat.id === id)?.key;

  const filteredProducts = selectedCategoryKey
    ? products.filter((p) =>
        p.categories?.some(
          (ref) => getCategoryKeyById(ref.id) === selectedCategoryKey,
        ),
      )
    : products;

  if (loading) return <Text px={4}>Loading products...</Text>;
  if (error)
    return (
      <Text px={4} color="red.500">
        Error loading products: {error}
      </Text>
    );

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
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ProductsPage;
