import {
  Box,
  Accordion,
  AccordionItem,
  Select,
  Button,
  Heading,
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
    const selected = categories.find(
      (c) => c.id === localFilters.categories[0],
    );
    onCategoryChange(selected?.key ?? null);
  };

  const resetFilters = () => {
    onResetFilters();
    setLocalFilters(defaultFilters);
    onCategoryChange(null);
  };

  return (
    <Box p={4} w="250px">
      <Heading size="md" mb={4}>
        Filters
      </Heading>

      <Box mb={4}>
        <Heading size="sm" mb={2}>
          Active Filters
        </Heading>
        <ActiveFilters filters={activeFilters} categories={categories} />
      </Box>

      <Accordion allowMultiple defaultIndex={[0, 1, 2, 3]} mb={4}>
        <AccordionItem>
          <Select
            value={
              categories.find((c) => c.id === localFilters.categories[0])
                ?.key ?? ''
            }
            onChange={(e) => handleCategoryChange(e.target.value || null)}
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
        onClick={resetFilters}
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
