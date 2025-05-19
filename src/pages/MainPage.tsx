import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  ClientResponse,
  Product,
  ProductPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { getME, getProducts } from '../services';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../features/user/userSlice';

const INITIAL_DATA_PRODUCTS: ProductPagedQueryResponse = {
  limit: 0,
  offset: 0,
  count: 0,
  results: [],
};

const MainPage = () => {
  const user = useAppSelector(selectUser);
  const bgProductCard = useColorModeValue('gray.50', 'gray.700');

  const [dataProducts, setDataProducts] = useState(INITIAL_DATA_PRODUCTS);

  useEffect(() => {
    getProducts()
      .then((data: ClientResponse<ProductPagedQueryResponse>) => {
        setDataProducts({ ...data.body });
      })
      .catch(console.error);
  }, []);

  const getProductList = (
    productData: ProductPagedQueryResponse,
    cardBg: string,
  ) => {
    return (
      <VStack spacing={6} align="stretch" mt={10}>
        <Heading size="md">Products ({productData.count})</Heading>

        {productData.results.map((product: Product) => {
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
              bg={cardBg}
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
        })}
      </VStack>
    );
  };

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <Center>
        <VStack spacing={4}>
          <Heading fontSize="3xl" color="primary.500">
            Welcome to our flower shop!
          </Heading>

          <Button
            onClick={() =>
              getME()
                .then((data) => console.log('User data is:', data))
                .catch((error) => console.log("User data doesn't found", error))
            }
            colorScheme="teal"
            size="sm"
          >
            Get Me
          </Button>

          <Text fontSize="md">
            Status:{' '}
            {user.isAuthenticated
              ? `Logged in as ${user.email}`
              : 'Not logged in'}
          </Text>
        </VStack>
      </Center>

      {getProductList(dataProducts, bgProductCard)}
    </Box>
  );
};

export default MainPage;
