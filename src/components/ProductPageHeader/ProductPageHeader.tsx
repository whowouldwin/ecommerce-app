import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import { Category } from '@commercetools/platform-sdk';
import CategoryNavigation from '../CategoryNavigation/CategoryNavigation';
import { getLocalizedText } from '../../utils/localization';

interface ProductPageHeaderProps {
  selectedCategoryKey: string | null;
  categories: Category[];
  onCategoryChange: (categoryKey: string | null) => void;
}

const ProductPageHeader = ({
  selectedCategoryKey,
  categories,
  onCategoryChange,
}: ProductPageHeaderProps) => {
  const headingColor = useColorModeValue('gray.900', 'white');

  const getCategoryName = (key: string): string => {
    const category = categories.find((cat) => cat.key === key);
    return getLocalizedText(category?.name, 'en-US');
  };

  return (
    <Box mb={6}>
      <Heading mb={4} color={headingColor}>
        {selectedCategoryKey
          ? `Products in "${getCategoryName(selectedCategoryKey)}"`
          : 'All Products'}
      </Heading>

      <CategoryNavigation
        categories={categories}
        selectedCategoryKey={selectedCategoryKey}
        onCategoryChange={onCategoryChange}
      />
    </Box>
  );
};

export default ProductPageHeader;
