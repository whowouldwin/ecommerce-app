import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Category } from '@commercetools/platform-sdk';
import { getLocalizedText } from '../../utils/localization';

interface CategoryNavigationProps {
  categories: Category[];
  selectedCategoryKey: string | null;
  onCategoryChange: (categoryKey: string | null) => void;
}

const CategoryNavigation = ({
  categories,
  selectedCategoryKey,
  onCategoryChange,
}: CategoryNavigationProps) => {
  const selectedCategory = categories.find(
    (cat) => cat.key === selectedCategoryKey,
  );

  const getParentCategories = (category: Category | undefined): Category[] => {
    if (!category || !category.parent) return [];

    const parentCategory = categories.find(
      (cat) => cat.id === category.parent?.id,
    );

    if (!parentCategory) return [];

    return [...getParentCategories(parentCategory), parentCategory];
  };

  const parentCategories = selectedCategory
    ? getParentCategories(selectedCategory)
    : [];

  return (
    <Box mb={6}>
      <Breadcrumb
        separator={<ChevronRightIcon color="gray.500" />}
        mb={4}
        fontSize={{ base: 'sm', md: 'md' }}
      >
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => onCategoryChange(null)}>
            All Products
          </BreadcrumbLink>
        </BreadcrumbItem>

        {parentCategories.map((cat) => (
          <BreadcrumbItem key={cat.id}>
            <BreadcrumbLink onClick={() => onCategoryChange(cat.key || null)}>
              {getLocalizedText(cat.name)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}

        {selectedCategory && (
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="semibold">
              {getLocalizedText(selectedCategory.name)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    </Box>
  );
};

export default CategoryNavigation;
