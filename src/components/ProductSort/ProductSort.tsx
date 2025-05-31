import {
  Select,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface ProductSortProps {
  sortOption: string | undefined;
  onChange: (value: string | undefined) => void;
}

const ProductSort = ({ sortOption, onChange }: ProductSortProps) => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.300', 'blue.600');
  const hoverBorderColor = useColorModeValue('blue.400', 'blue.500');

  return (
    <Flex align="center" gap={2}>
      <Text fontWeight="medium" fontSize="sm">
        Sort by:
      </Text>
      <Select
        value={sortOption || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        size="sm"
        width="200px"
        bg={sortOption ? bgColor : undefined}
        borderColor={sortOption ? borderColor : 'gray.300'}
        _hover={{
          borderColor: sortOption ? hoverBorderColor : 'gray.400',
        }}
      >
        <option value="">Default</option>
        <option value="name.en-US asc">Name: A to Z</option>
        <option value="name.en-US desc">Name: Z to A</option>
        <option value="price asc">Price: Low to High</option>
        <option value="price desc">Price: High to Low</option>
      </Select>
      {sortOption && (
        <Button
          size="xs"
          colorScheme="blue"
          variant="ghost"
          onClick={() => onChange(undefined)}
        >
          Clear
        </Button>
      )}
    </Flex>
  );
};

export default ProductSort;
