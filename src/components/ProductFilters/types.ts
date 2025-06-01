import { Category, ProductProjection } from '@commercetools/platform-sdk';
import { FilterState } from '../../features/filter/filterSlice';

export interface ProductFiltersProps {
  products: ProductProjection[];
  onFilterChange: (newFilters: FilterState) => void;
  activeFilters: FilterState;
  onResetFilters: () => void;
  categories: Category[];
  onCategoryChange: (categoryKey: string | null) => void;
  selectedCategoryKey: string | null;
}
