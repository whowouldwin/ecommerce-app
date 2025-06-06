import {
  Box,
  Text,
  SimpleGrid,
  Skeleton,
  Flex,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { ProductProjection } from '@commercetools/platform-sdk';
import ProductCard from '../ProductCard';
import { FilterState } from '../../features/filter/filterSlice';

interface ProductListProps {
  products: ProductProjection[];
  loading: boolean;
  filters: FilterState;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  productsPerPage: number;
}

const ProductList = ({
  products,
  loading,
  filters,
  currentPage,
  setCurrentPage,
  productsPerPage,
}: ProductListProps) => {
  return (
    <>
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
              <Skeleton key={product.id} isLoaded={!loading} fadeDuration={0.3}>
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
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                isDisabled={currentPage === 1}
              >
                Previous
              </Button>

              <Button
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                isDisabled={products.length < productsPerPage}
              >
                Next
              </Button>
            </ButtonGroup>
          </Flex>
        </>
      )}
    </>
  );
};

export default ProductList;
