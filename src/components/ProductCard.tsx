import {
  Box,
  Image,
  Text,
  Flex,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { ProductProjection } from '@commercetools/platform-sdk';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HighlightedText from './HighlightedText';
import { getLocalizedText } from '../utils/localization.ts';
import { extractPriceInfo, formatPrice } from '../utils/price.ts';
import { RootState } from '../store/store';
import AddToCartButton from './AddToCartButton.tsx';

type ProductCardProps = {
  product: ProductProjection;
  searchQuery?: string;
};

const ProductCard = ({ product, searchQuery = '' }: ProductCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const categoryBg = useColorModeValue('blue.100', 'blue.900');
  const categoryColor = useColorModeValue('blue.800', 'blue.200');
  const categories = useSelector(
    (state: RootState) => state.category.categories,
  );
  const navigate = useNavigate();

  const imageUrl =
    product.masterVariant?.images?.[0]?.url ||
    product.variants?.[0]?.images?.[0]?.url ||
    '/placeholder.png';

  const { originalPrice, discountedPrice, currency } =
    extractPriceInfo(product);

  const productCategories = product.categories || [];

  const categoryNames = productCategories
    .map((categoryRef) => {
      const category = categories.find((cat) => cat.id === categoryRef.id);
      return category ? getLocalizedText(category.name) : '';
    })
    .filter(Boolean);

  return (
    <Box
      w="full"
      maxW="280px"
      mx="auto"
      borderRadius="xl"
      boxShadow="md"
      overflow="hidden"
      bg={cardBg}
      display="flex"
      flexDirection="column"
      height="100%"
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{
        transform: 'scale(1.02)',
        boxShadow: 'lg',
      }}
    >
      <Box
        h="200px"
        w="100%"
        overflow="hidden"
        onClick={() => {
          navigate(`/product/${product.id}`);
        }}
        cursor="pointer"
      >
        <Image
          src={imageUrl}
          alt={getLocalizedText(product.name)}
          w="100%"
          h="100%"
          objectFit="cover"
        />
      </Box>

      <Box
        p={4}
        textAlign="center"
        display="flex"
        flexDirection="column"
        flex="1"
      >
        <HighlightedText
          text={getLocalizedText(product.name)}
          highlight={searchQuery}
          fontWeight="bold"
          fontSize="md"
          mb={1}
        />
        <HighlightedText
          text={getLocalizedText(product.description)}
          highlight={searchQuery}
          fontSize="sm"
          color={textColor}
          noOfLines={2}
        />

        {categoryNames.length > 0 && (
          <Flex wrap="wrap" justify="center" gap={1} mb={2}>
            {categoryNames.map((name, index) => (
              <Box
                key={index}
                bg={categoryBg}
                color={categoryColor}
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
                fontWeight="medium"
              >
                {name}
              </Box>
            ))}
          </Flex>
        )}

        <Flex justify="center" align="center" gap={2} mb={4}>
          {discountedPrice ? (
            <>
              <Text fontWeight="bold" color="red.500" fontSize="lg">
                {formatPrice(discountedPrice, currency)}
              </Text>
              <Text as="s" color="gray.500" fontSize="sm">
                {formatPrice(originalPrice, currency)}
              </Text>
            </>
          ) : (
            <Text fontWeight="bold" color="green.500">
              {formatPrice(originalPrice, currency)}
            </Text>
          )}
        </Flex>

        <Flex
          justify="center"
          gap={3}
          direction={{ base: 'column', md: 'row' }}
          align="stretch"
          mt="auto"
          flexWrap="wrap"
          alignItems="center"
        >
          <Box onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              w="full"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              View details
            </Button>
          </Box>

          <Box onClick={(e) => e.stopPropagation()}>
            <AddToCartButton
              productId={product.id}
              variantId={product.masterVariant.id}
              sizeButton="sm"
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductCard;
