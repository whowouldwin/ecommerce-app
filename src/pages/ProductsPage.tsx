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
  Button,
  ButtonGroup,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
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
import ProductSort from '../components/ProductSort/ProductSort.tsx';

const ProductsPage = () => {
  const headingColor = useColorModeValue('gray.900', 'white');
  const { categoryKey } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector((state: RootState) =>
    state.product.loading
      ? state.product.previousProducts
      : state.product.products,
  );
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
  const [searchInput, setSearchInput] = useState('');
  const productsPerPage = 12;

  const fetchProductsWithParams = () => {
    dispatch(
      fetchProducts({
        sort: sortOption,
        limit: productsPerPage,
        offset: (currentPage - 1) * productsPerPage,
        searchText: filters.searchText,
        language: 'en-US',
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
    setSearchInput('');
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
    return getLocalizedText(category?.name, 'en-US');
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
          <Flex direction="column" mb={4} gap={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    dispatch(
                      setFilters({ ...filters, searchText: searchInput }),
                    );
                    setCurrentPage(1);
                  }
                }}
                borderRadius="md"
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px blue.500',
                }}
              />
              <Button
                ml={2}
                onClick={() => {
                  dispatch(setFilters({ ...filters, searchText: searchInput }));
                  setCurrentPage(1);
                }}
                colorScheme="blue"
                isDisabled={
                  !searchInput.trim() || searchInput === filters.searchText
                }
              >
                Find
              </Button>
            </InputGroup>

            <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
              <Box>
                <ProductSort sortOption={sortOption} onChange={setSortOption} />
              </Box>
              <Text fontSize="sm" color="gray.500">
                Showing {products.length} products
              </Text>
            </Flex>
          </Flex>

          {products.length === 0 && !loading ? (
            <Box textAlign="center" py={8}>
              <Text>No products found. Try adjusting your filters.</Text>
            </Box>
          ) : (
            <>
              {loading && (
                <Box textAlign="center" py={4}>
                  <Text fontSize="sm" color="gray.500">
                    Updating products...
                  </Text>
                </Box>
              )}

              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                {products.map((product) => (
                  <Skeleton
                    key={product.id}
                    isLoaded={!loading}
                    fadeDuration={0.3}
                  >
                    <ProductCard
                      product={product}
                      searchQuery={filters.searchText}
                    />
                  </Skeleton>
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
