import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { setFilters } from '../../features/filter/filterSlice';
import { FilterState } from '../../features/filter/filterSlice';

interface ProductSearchProps {
  filters: FilterState;
  onSearch: () => void;
  setCurrentPage: (page: number) => void;
}

const ProductSearch = ({
  filters,
  onSearch,
  setCurrentPage,
}: ProductSearchProps) => {
  const [searchInput, setSearchInput] = useState(filters.searchText || '');
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(setFilters({ ...filters, searchText: searchInput }));
    setCurrentPage(1);
    onSearch();
  };

  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      gap={2}
      align="stretch"
      mb={4}
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
              handleSearch();
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
        onClick={handleSearch}
        colorScheme="blue"
        isDisabled={!searchInput.trim() || searchInput === filters.searchText}
        size={{ base: 'sm', sm: 'md' }}
        width={{ base: '100%', sm: 'auto' }}
      >
        Find
      </Button>
    </Flex>
  );
};

export default ProductSearch;
