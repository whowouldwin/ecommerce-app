import {
  Box,
  Accordion,
  AccordionItem,
  Button,
  Heading,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { JSX, useEffect, useState } from 'react';
import { Category } from '@commercetools/platform-sdk';
import { ProductFiltersProps } from './types';
import { defaultFilters, FilterState } from '../../features/filter/filterSlice';
import {
  getFilterOptions,
  FilterOptions,
} from '../../services/filters.service';

import FilterCheckboxGroup from './FilterCheckboxGroup';
import PriceRangeFilter from './PriceRangeFilter';
import ActiveFilters from './ActiveFilters';
import CategoryItem from './CategoryItem.tsx';

type CategoryWithChildren = Category & { children: CategoryWithChildren[] };

const buildCategoryTree = (categories: Category[]): CategoryWithChildren[] => {
  const map = new Map<string, CategoryWithChildren>();
  categories.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));
  const roots: CategoryWithChildren[] = [];
  for (const cat of map.values()) {
    if (cat.parent?.id && map.has(cat.parent.id)) {
      map.get(cat.parent.id)!.children.push(cat);
    } else {
      roots.push(cat);
    }
  }
  return roots;
};

const renderCategoryTree = (
  nodes: CategoryWithChildren[],
  selectedIds: string[],
  onSelect: (id: string) => void,
  level = 0,
): JSX.Element[] =>
  nodes.map((node) => (
    <CategoryItem
      key={node.id}
      node={node}
      selectedIds={selectedIds}
      onSelect={onSelect}
      level={level}
    />
  ));

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

  const handleCategorySelect = (id: string) => {
    setLocalFilters({ ...localFilters, categories: [id] });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
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

  const categoryTree = buildCategoryTree(categories);

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
          <Box p={4}>
            <Heading size="sm" mb={2}>
              Category
            </Heading>
            <VStack align="start" spacing={1} w="full">
              {renderCategoryTree(
                categoryTree,
                localFilters.categories,
                handleCategorySelect,
              )}
            </VStack>
          </Box>
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
