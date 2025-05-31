import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Grid,
  GridItem,
  useColorModeValue,
  Flex,
  Select,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { fetchProducts } from '../features/product/productSlice';
import {
  setFilters,
  resetFilters,
  FilterState,
} from '../features/filter/filterSlice';
import {
  fetchCategories,
  setSelectedCategoryKey,
} from '../features/category/categorySlice';
import { AppDispatch, RootState } from '../store/store';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters/ProductFilters.tsx';
import { getLocalizedText } from '../utils/localization';

const ProductsPage = () => {
  const headingColor = useColorModeValue('gray.900', 'white');
  const { categoryKey } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector((state: RootState) => state.product.products);
  const loading = useSelector((state: RootState) => state.product.loading);
  const filters = useSelector((state: RootState) => state.filters);
  const selectedCategoryKey = useSelector(
    (state: RootState) => state.category.selectedCategoryKey,
  );
  const categories = useSelector(
    (state: RootState) => state.category.categories,
  );
  const categoriesLoaded = useSelector(
    (state: RootState) => state.category.categoriesLoaded,
  );

  const [sortOption, setSortOption] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const fetchProductsWithParams = () => {
    dispatch(
      fetchProducts({
        sort: sortOption,
        limit: productsPerPage,
        offset: (currentPage - 1) * productsPerPage,
      }),
    );
  };

  useEffect(() => {
    if (!categoriesLoaded) dispatch(fetchCategories());
  }, [dispatch, categoriesLoaded]);

  useEffect(() => {
    if (!categoriesLoaded || !categoryKey) return;

    const category = categories.find((cat) => cat.key === categoryKey);
    const categoryId = category?.id;

    if (
      categoryId &&
      (!filters.categories.includes(categoryId) ||
        filters.categories.length !== 1)
    ) {
      dispatch(setFilters({ ...filters, categories: [categoryId] }));
    }

    dispatch(setSelectedCategoryKey(categoryKey));
  }, [categoryKey, categoriesLoaded, categories]);

  useEffect(() => {
    fetchProductsWithParams();
  }, [filters, sortOption, currentPage]);

  const handleFilterChange = (newFilters: FilterState) => {
    setCurrentPage(1);
    dispatch(setFilters(newFilters));
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setSortOption(undefined);
    dispatch(resetFilters());
    dispatch(setSelectedCategoryKey(null));
  };

  const handleCategoryChange = (newKey: string | null) => {
    setCurrentPage(1);
    if (newKey) {
      navigate(`/products/${newKey}`);
    } else {
      navigate('/products');
    }
  };

  const getCategoryName = (key: string): string => {
    const category = categories.find((cat) => cat.key === key);
    return getLocalizedText(category?.name, 'en');
  };

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={10}>
      <Heading mb={6} color={headingColor}>
        {selectedCategoryKey
          ? `Products in "${getCategoryName(selectedCategoryKey)}"`
          : 'All Products'}
      </Heading>

      <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={6}>
        <GridItem>
          <ProductFilters
            products={products}
            onFilterChange={handleFilterChange}
            activeFilters={filters}
            onResetFilters={handleResetFilters}
            categories={categories}
            onCategoryChange={handleCategoryChange}
          />
        </GridItem>

        <GridItem>
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            wrap="wrap"
            gap={2}
          >
            <Box>
              <Select
                placeholder="Sort by"
                value={sortOption || ''}
                onChange={(e) => setSortOption(e.target.value || undefined)}
                size="sm"
                width="200px"
              >
                <option value="">Default</option>
                <option value="name.en-US asc">Name: A to Z</option>
                <option value="name.en-US desc">Name: Z to A</option>
                <option value="price asc">Price: Low to High</option>
                <option value="price desc">Price: High to Low</option>
              </Select>
            </Box>
            <Text fontSize="sm" color="gray.500">
              Showing {products.length} products
            </Text>
          </Flex>

          {loading ? (
            <Box textAlign="center" py={8}>
              <Text>Updating products...</Text>
            </Box>
          ) : products.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text>No products found. Try adjusting your filters.</Text>
            </Box>
          ) : (
            <>
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </SimpleGrid>

              <Flex justify="center" mt={8}>
                <ButtonGroup>
                  <Button
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    isDisabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    isDisabled={products.length < productsPerPage}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </Flex>
            </>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ProductsPage;
