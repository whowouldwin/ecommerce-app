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
import { FilterState, defaultFilters } from '../features/filter/filterSlice';
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

  const [localFilters, setLocalFilters] = useState<FilterState>(activeFilters);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

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
    setLocalFilters({ ...localFilters, [key]: values });
  };

  const handlePriceChange = (value: number) => {
    setLocalFilters({ ...localFilters, priceRange: [0, value] });
  };

  const handleCategoryChange = (categoryKey: string | null) => {
    const category = categories.find((cat) => cat.key === categoryKey);
    const categoryId = category?.id ?? null;

    setLocalFilters({
      ...localFilters,
      categories: categoryId ? [categoryId] : [],
    });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    const selectedCategory = categories.find(
      (c) => c.id === localFilters.categories[0],
    );
    onCategoryChange(selectedCategory?.key ?? null);
  };

  const handleResetFilters = () => {
    onResetFilters();
    setLocalFilters(defaultFilters);
    onCategoryChange(null);
  };

  const filtersChanged =
    JSON.stringify(localFilters) !== JSON.stringify(activeFilters);

  const isResetDisabled =
    JSON.stringify(localFilters) === JSON.stringify(defaultFilters);

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
            value={localFilters[filterKey]}
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

  const selectedCategoryId = localFilters.categories[0];
  const selectedCategoryKey =
    categories.find((cat) => cat.id === selectedCategoryId)?.key ?? '';

  return (
    <Box p={4} w="250px">
      <Heading size="md" mb={4}>
        Filters
      </Heading>

      <Box mb={4}>
        <Heading size="sm" mb={2}>
          Active Filters
        </Heading>
        <Flex wrap="wrap" gap={2}>
          {activeFilters.brand.length > 0 ||
          activeFilters.color.length > 0 ||
          activeFilters.size.length > 0 ||
          activeFilters.materials.length > 0 ||
          activeFilters.priceRange ||
          activeFilters.categories.length > 0 ? (
            <>
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
            </>
          ) : (
            <Text fontSize="sm" color="gray.500">
              No filters applied yet. Select filters and click Apply Filters.
            </Text>
          )}
        </Flex>
      </Box>

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
              value={selectedCategoryKey}
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
              {localFilters.priceRange ? localFilters.priceRange[1] : 1000}
            </Text>
            <Slider
              aria-label="price-slider"
              value={localFilters.priceRange?.[1] ?? 1000}
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

      <Button
        mt={2}
        colorScheme="teal"
        onClick={applyFilters}
        width="100%"
        mb={2}
        isDisabled={!filtersChanged}
        variant={filtersChanged ? 'solid' : 'outline'}
      >
        Apply Filters
      </Button>

      <Button
        colorScheme="red"
        onClick={handleResetFilters}
        width="100%"
        isDisabled={isResetDisabled}
        variant={isResetDisabled ? 'outline' : 'solid'}
      >
        Reset All Filters
      </Button>
    </Box>
  );
};

export default ProductFilters;
