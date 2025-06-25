import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { Category } from '@commercetools/platform-sdk';
import { ProductProjection } from '@commercetools/platform-sdk';
import ProductFilters from './ProductFilters';
import { FilterState } from '../../features/filter/filterSlice';

interface MobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductProjection[];
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
  onResetFilters: () => void;
  categories: Category[];
  onCategoryChange: (categoryKey: string | null) => void;
  selectedCategoryKey: string | null;
}

const MobileFiltersDrawer = ({
  isOpen,
  onClose,
  products,
  onFilterChange,
  activeFilters,
  onResetFilters,
  categories,
  onCategoryChange,
  selectedCategoryKey,
}: MobileFiltersDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filters</DrawerHeader>
        <DrawerBody>
          <ProductFilters
            products={products}
            onFilterChange={(newFilters) => {
              onFilterChange(newFilters);
              onClose();
            }}
            activeFilters={activeFilters}
            onResetFilters={onResetFilters}
            categories={categories}
            onCategoryChange={onCategoryChange}
            selectedCategoryKey={selectedCategoryKey}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFiltersDrawer;
