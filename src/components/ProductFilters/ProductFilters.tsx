import {
  Box,
  Accordion,
  AccordionItem,
  Select,
  Button,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ProductFiltersProps } from './types';
import { defaultFilters, FilterState } from '../../features/filter/filterSlice';
import {
  getFilterOptions,
  FilterOptions,
} from '../../services/filters.service';
import { getLocalizedText } from '../../utils/localization';

import FilterCheckboxGroup from './FilterCheckboxGroup';
import PriceRangeFilter from './PriceRangeFilter';
import ActiveFilters from './ActiveFilters';

const ProductFilters = ({
  onFilterChange,
  activeFilters,
  onResetFilters,
  categories,
  onCategoryChange,
  selectedCategoryKey,
}: ProductFiltersProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    colors: [],
    sizes: [],
    materials: [],
  });

  const [localFilters, setLocalFilters] = useState<FilterState>(activeFilters);
  const [loading, setLoading] = useState(false);

  const filtersChanged =
    JSON.stringify(localFilters) !== JSON.stringify(activeFilters);
  const isResetDisabled =
    JSON.stringify(localFilters) === JSON.stringify(defaultFilters);

  useEffect(() => setLocalFilters(activeFilters), [activeFilters]);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const options = await getFilterOptions();
        setFilterOptions(options);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleCheckboxChange = (
    key: keyof Pick<FilterState, 'brand' | 'color' | 'size' | 'materials'>,
    values: string[],
  ) => {
    setLocalFilters({ ...localFilters, [key]: values });
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setLocalFilters({ ...localFilters, priceRange: value });
  };

  const handleCategoryChange = (key: string | null) => {
    const cat = categories.find((c) => c.key === key);
    setLocalFilters({ ...localFilters, categories: cat?.id ? [cat.id] : [] });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    if (localFilters.categories.length === 0) {
      if (
        categories.find((c) => c.key === null) ||
        selectedCategoryKey !== null
      ) {
        onCategoryChange(null);
      }
      return;
    }
    const selected = categories.find(
      (c) => c.id === localFilters.categories[0],
    );
    const newCategoryKey = selected?.key ?? null;

    if (newCategoryKey !== selectedCategoryKey) {
      onCategoryChange(newCategoryKey);
    }
  };

  const resetFilters = () => {
    onResetFilters();
    setLocalFilters(defaultFilters);
    onCategoryChange(null);
  };

  return (
    <Box p={{ base: 3, md: 4 }} w="100%">
      <Heading size="md" mb={{ base: 3, md: 4 }}>
        Filters
      </Heading>

      <Box mb={{ base: 3, md: 4 }}>
        <Heading size="sm" mb={2}>
          Active Filters
        </Heading>
        <ActiveFilters filters={activeFilters} categories={categories} />
      </Box>

      <Accordion
        allowMultiple
        defaultIndex={[0, 1, 2, 3]}
        mb={{ base: 3, md: 4 }}
      >
        <AccordionItem>
          <Select
            value={
              categories.find((c) => c.id === localFilters.categories[0])
                ?.key ?? ''
            }
            onChange={(e) => handleCategoryChange(e.target.value || null)}
            size={{ base: 'sm', md: 'md' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.key ?? ''}>
                {getLocalizedText(c.name)}
              </option>
            ))}
          </Select>
        </AccordionItem>

        <FilterCheckboxGroup
          label="Brand"
          filterKey="brand"
          options={filterOptions.brands}
          values={localFilters.brand}
          onChange={(vals) => handleCheckboxChange('brand', vals)}
          loading={loading}
        />
        <FilterCheckboxGroup
          label="Color"
          filterKey="color"
          options={filterOptions.colors}
          values={localFilters.color}
          onChange={(vals) => handleCheckboxChange('color', vals)}
          loading={loading}
        />
        <FilterCheckboxGroup
          label="Size"
          filterKey="size"
          options={filterOptions.sizes}
          values={localFilters.size}
          onChange={(vals) => handleCheckboxChange('size', vals)}
          loading={loading}
        />
        <FilterCheckboxGroup
          label="Material"
          filterKey="materials"
          options={filterOptions.materials}
          values={localFilters.materials}
          onChange={(vals) => handleCheckboxChange('materials', vals)}
          loading={loading}
        />

        <PriceRangeFilter
          value={localFilters.priceRange ?? [0, 100]}
          onChange={handlePriceRangeChange}
        />
      </Accordion>

      <Stack spacing={2} align="start">
        <Button
          colorScheme="teal"
          onClick={applyFilters}
          isDisabled={!filtersChanged}
          variant={filtersChanged ? 'solid' : 'outline'}
          size={{ base: 'sm', md: 'md' }}
        >
          Apply Filters
        </Button>

        <Button
          colorScheme="red"
          onClick={resetFilters}
          isDisabled={isResetDisabled}
          variant={isResetDisabled ? 'outline' : 'solid'}
          size={{ base: 'sm', md: 'md' }}
        >
          Reset All Filters
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductFilters;
