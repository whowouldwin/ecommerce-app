import { Product } from '@commercetools/platform-sdk';
import { Box, Heading, Image, Text } from '@chakra-ui/react';

type Props = {
  product: Product;
  bg: string;
};

const ProductCard = ({ product, bg }: Props) => {
  const productInfo = product.masterData.current;
  const productImage = productInfo.masterVariant.images?.[0];
  const productPrice = productInfo.masterVariant.prices?.[0];

  return (
    <Box
      key={product.id}
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={bg}
    >
      <Heading fontSize="xl">{productInfo.name['en-US']}</Heading>

      {productImage && (
        <Image
          src={productImage.url}
          alt="Product"
          boxSize="200px"
          objectFit="cover"
          mt={2}
        />
      )}

      <Text mt={2}>
        {productInfo.description?.['en-US'] || 'No description'}
      </Text>

      {productPrice && (
        <Text mt={2} fontWeight="bold">
          Price:{' '}
          {(
            productPrice.value.centAmount /
            10 ** productPrice.value.fractionDigits
          ).toFixed(productPrice.value.fractionDigits)}{' '}
          {productPrice.value.currencyCode}
        </Text>
      )}
    </Box>
  );
};
export default ProductCard;
