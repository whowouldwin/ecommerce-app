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
  useDisclosure,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { fetchProducts } from '../features/product/productSlice';
import {
  setFilters,
  resetFilters,
  FilterState,
  setFilterField,
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
import CategoryNavigation from '../components/CategoryNavigation/CategoryNavigation.tsx';
import ActiveFilters from '../components/ProductFilters/ActiveFilters.tsx';

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

  const { isOpen, onOpen, onClose } = useDisclosure();

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
    if (!categoriesLoaded) {
      dispatch(fetchCategories());
      return;
    }
    const matchedCategory = categories.find((cat) => cat.key === categoryKey);
    const categoryId = matchedCategory?.id ?? null;
    const needUpdate = categoryId
      ? filters.categories[0] !== categoryId || filters.categories.length !== 1
      : filters.categories.length > 0;

    if (needUpdate) {
      dispatch(
        setFilters({
          ...filters,
          categories: categoryId ? [categoryId] : [],
        }),
      );
    }

    dispatch(setSelectedCategoryKey(categoryKey ?? null));
  }, [categoryKey, categoriesLoaded, categories]);

  useEffect(() => {
    if (!categoriesLoaded) return;
    fetchProductsWithParams();
  }, [filters, sortOption, currentPage, categoriesLoaded]);

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
    setSearchInput('');
    dispatch(setFilterField({ key: 'searchText', value: '' }));
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
      <Heading mb={4} color={headingColor}>
        {selectedCategoryKey
          ? `Products in "${getCategoryName(selectedCategoryKey)}"`
          : 'All Products'}
      </Heading>

      <CategoryNavigation
        categories={categories}
        selectedCategoryKey={selectedCategoryKey}
        onCategoryChange={handleCategoryChange}
      />

      <Box mb={4} display={{ base: 'block', md: 'none' }}>
        <Flex justify="space-between" align="center" mb={2}>
          <Heading size="sm">Active Filters</Heading>
          <IconButton
            aria-label="Open filters"
            icon={<FaFilter />}
            size="sm"
            onClick={onOpen}
            colorScheme="blue"
          />
        </Flex>
        <ActiveFilters filters={filters} categories={categories} />
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <ProductFilters
              products={products}
              onFilterChange={(newFilters) => {
                handleFilterChange(newFilters);
                onClose();
              }}
              activeFilters={filters}
              onResetFilters={handleResetFilters}
              categories={categories}
              onCategoryChange={handleCategoryChange}
              selectedCategoryKey={selectedCategoryKey}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={6}>
        <GridItem display={{ base: 'none', md: 'block' }}>
          <ProductFilters
            products={products}
            onFilterChange={handleFilterChange}
            activeFilters={filters}
            onResetFilters={handleResetFilters}
            categories={categories}
            onCategoryChange={handleCategoryChange}
            selectedCategoryKey={selectedCategoryKey}
          />
        </GridItem>

        <GridItem>
          <Flex direction="column" mb={4} gap={4}>
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              gap={2}
              align="stretch"
            >
              <InputGroup flex="1">
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
              </InputGroup>

              <Button
                onClick={() => {
                  dispatch(setFilters({ ...filters, searchText: searchInput }));
                  setCurrentPage(1);
                }}
                colorScheme="blue"
                isDisabled={
                  !searchInput.trim() || searchInput === filters.searchText
                }
                size={{ base: 'sm', sm: 'md' }}
                width={{ base: '100%', sm: 'auto' }}
              >
                Find
              </Button>
            </Flex>

            <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
              <Box>
                <ProductSort
                  sortOption={sortOption}
                  onChange={(value) => {
                    setSortOption(value);
                    setCurrentPage(1);
                  }}
                />
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
