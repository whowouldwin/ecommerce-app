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
      <Text fontSize="sm" color="gray.500">
        No filters applied yet. Select filters and click Apply Filters.
      </Text>
    );
  }

  return (
    <Flex wrap="wrap" gap={2}>
      {['brand', 'color', 'size', 'materials'].flatMap((key) =>
        (filters[key as keyof FilterState] as string[]).map((val) => (
          <Badge key={`${key}-${val}`} colorScheme="teal">
            {val}
          </Badge>
        )),
      )}
      {filters.categories.map((id) => {
        const cat = categories.find((c) => c.id === id);
        return (
          <Badge key={id} colorScheme="cyan">
            {getLocalizedText(cat?.name, 'en') || id}
          </Badge>
        );
      })}
      {filters.priceRange && (
        <Badge colorScheme="purple">
          Price: €{filters.priceRange[0].toFixed(2)} – €
          {filters.priceRange[1].toFixed(2)}
        </Badge>
      )}
    </Flex>
  );
};

export default ActiveFilters;
