import {
  Box,
  Checkbox,
  CheckboxGroup,
  Stack,
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Badge,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Category, ProductProjection } from '@commercetools/platform-sdk';
import { FilterState } from '../features/filter/filterSlice';
import { getLocalizedText } from '../utils/localization';
import { getFilterOptions, FilterOptions } from '../services/filters.service';

interface ProductFiltersProps {
  products: ProductProjection[];
  onFilterChange: (newFilters: FilterState) => void;
  activeFilters: FilterState;
  onResetFilters: () => void;
  categories: Category[];
  onCategoryChange: (categoryKey: string | null) => void;
}

const ProductFilters = ({
  onFilterChange,
  activeFilters,
  onResetFilters,
  categories,
  onCategoryChange,
}: ProductFiltersProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    colors: [],
    sizes: [],
    materials: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoading(true);
      try {
        const options = await getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilterOptions();
  }, []);

  const handleCheckboxChange = (
    key: keyof Pick<FilterState, 'brand' | 'color' | 'size' | 'materials'>,
    values: string[],
  ) => {
    onFilterChange({ ...activeFilters, [key]: values });
  };

  const handlePriceChange = (value: number) => {
    onFilterChange({ ...activeFilters, priceRange: [0, value] });
  };

  const handleCategoryChange = (categoryKey: string | null) => {
    const category = categories.find((cat) => cat.key === categoryKey);
    const categoryId = category?.id ?? null;

    onFilterChange({
      ...activeFilters,
      categories: categoryId ? [categoryId] : [],
    });

    onCategoryChange(categoryKey);
  };

  type FilterKey = 'brand' | 'color' | 'size' | 'materials';

  const renderCheckboxGroup = (
    label: string,
    filterKey: FilterKey,
    options: string[],
  ) => (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Heading size="sm">{label}</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {loading ? (
          <Flex justify="center" py={2}>
            <Spinner size="sm" />
          </Flex>
        ) : (
          <CheckboxGroup
            value={activeFilters[filterKey]}
            onChange={(vals: string[]) => handleCheckboxChange(filterKey, vals)}
          >
            <Stack spacing={1}>
              {options.length > 0 ? (
                options.map((value) => (
                  <Checkbox key={value} value={value}>
                    {getLocalizedText({ en: value })}
                  </Checkbox>
                ))
              ) : (
                <Text fontSize="sm" color="gray.500">
                  No {label.toLowerCase()} available
                </Text>
              )}
            </Stack>
          </CheckboxGroup>
        )}
      </AccordionPanel>
    </AccordionItem>
  );

  return (
    <Box p={4} w="250px">
      <Heading size="md" mb={4}>
        Filters
      </Heading>

      {(activeFilters.brand.length > 0 ||
        activeFilters.color.length > 0 ||
        activeFilters.size.length > 0 ||
        activeFilters.materials.length > 0 ||
        activeFilters.categories.length > 0 ||
        activeFilters.priceRange) && (
        <Box mb={4}>
          <Heading size="sm" mb={2}>
            Active Filters
          </Heading>
          <Flex wrap="wrap" gap={2}>
            {['brand', 'color', 'size', 'materials'].flatMap((k) =>
              (activeFilters[k as keyof FilterState] as string[]).map((v) => (
                <Badge key={`${k}-${v}`} colorScheme="teal">
                  {v}
                </Badge>
              )),
            )}
            {activeFilters.categories.map((id) => {
              const cat = categories.find((c) => c.id === id);
              return (
                <Badge key={id} colorScheme="cyan">
                  {getLocalizedText(cat?.name, 'en') || id}
                </Badge>
              );
            })}
            {activeFilters.priceRange && (
              <Badge colorScheme="purple">
                Price: ${activeFilters.priceRange[0]} - $
                {activeFilters.priceRange[1]}
              </Badge>
            )}
          </Flex>
        </Box>
      )}

      <Accordion allowMultiple defaultIndex={[0, 1, 2, 3]} mb={4}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading size="sm">Category</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Select
              placeholder="Select category"
              value={(() => {
                const categoryId = activeFilters.categories[0];
                return (
                  categories.find((cat) => cat.id === categoryId)?.key || ''
                );
              })()}
              onChange={(e) => handleCategoryChange(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.key || ''}>
                  {getLocalizedText(category.name)}
                </option>
              ))}
            </Select>
          </AccordionPanel>
        </AccordionItem>

        {renderCheckboxGroup('Brand', 'brand', filterOptions.brands)}
        {renderCheckboxGroup('Color', 'color', filterOptions.colors)}
        {renderCheckboxGroup('Size', 'size', filterOptions.sizes)}
        {renderCheckboxGroup('Material', 'materials', filterOptions.materials)}

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading size="sm">Price Range</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text mb={2}>
              Up to $
              {activeFilters.priceRange ? activeFilters.priceRange[1] : 1000}
            </Text>
            <Slider
              aria-label="price-slider"
              value={activeFilters.priceRange?.[1] ?? 1000}
              max={1000}
              step={50}
              onChange={handlePriceChange}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Button mt={2} colorScheme="red" onClick={onResetFilters} width="100%">
        Reset All Filters
      </Button>
    </Box>
  );
};

export default ProductFilters;
