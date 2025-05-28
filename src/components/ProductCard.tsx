import {
  Box,
  Image,
  Text,
  Flex,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { ProductProjection } from '@commercetools/platform-sdk';
import { getLocalizedText } from '../utils/localization.ts';
import { extractPriceInfo, formatPrice } from '../utils/price.ts';

type ProductCardProps = {
  product: ProductProjection;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const imageUrl =
    product.masterVariant?.images?.[0]?.url ||
    product.variants?.[0]?.images?.[0]?.url ||
    '/placeholder.png';

  const { originalPrice, discountedPrice, currency } =
    extractPriceInfo(product);

  return (
    <Box borderRadius="xl" boxShadow="md" overflow="hidden" bg={cardBg}>
      <Image
        src={imageUrl}
        alt={getLocalizedText(product.name)}
        w="100%"
        h="auto"
        objectFit="cover"
      />

      <Box p={4} textAlign="center">
        <Text fontWeight="bold" fontSize="md" mb={1}>
          {getLocalizedText(product.name)}
        </Text>
        <Text fontSize="sm" mb={2} color={textColor}>
          {getLocalizedText(product.description)}
        </Text>

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

        <Flex justify="center" gap={3}>
          <Button variant="outline" borderColor="gray.300">
            View details
          </Button>
          <Button colorScheme="green">Add to Cart</Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductCard;
