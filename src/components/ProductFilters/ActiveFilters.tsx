import { Badge, Flex, Text } from '@chakra-ui/react';
import { Category } from '@commercetools/platform-sdk';
import { FilterState } from '../../features/filter/filterSlice';
import { getLocalizedText } from '../../utils/localization';

interface Props {
  filters: FilterState;
  categories: Category[];
}

const ActiveFilters = ({ filters, categories }: Props) => {
  if (
    filters.brand.length === 0 &&
    filters.color.length === 0 &&
    filters.size.length === 0 &&
    filters.materials.length === 0 &&
    !filters.priceRange &&
    filters.categories.length === 0
  ) {
    return (
      <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">
        No filters applied yet. Select filters and click Apply Filters.
      </Text>
    );
  }

  return (
    <Flex wrap="wrap" gap={{ base: 1, md: 2 }}>
      {['brand', 'color', 'size', 'materials'].flatMap((key) =>
        (filters[key as keyof FilterState] as string[]).map((val) => (
          <Badge
            key={`${key}-${val}`}
            colorScheme="teal"
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {val}
          </Badge>
        )),
      )}
      {filters.categories.map((id) => {
        const cat = categories.find((c) => c.id === id);
        return (
          <Badge
            key={id}
            colorScheme="cyan"
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {getLocalizedText(cat?.name, 'en-US') || id}
          </Badge>
        );
      })}
      {filters.priceRange && (
        <Badge colorScheme="purple" fontSize={{ base: 'xs', md: 'sm' }}>
          Price: €{filters.priceRange[0].toFixed(2)} – €
          {filters.priceRange[1].toFixed(2)}
        </Badge>
      )}
    </Flex>
  );
};

export default ActiveFilters;
