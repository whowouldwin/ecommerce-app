import {
  Box,
  Center,
  Text,
  VStack,
  Button,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import {
  selectCartLineItems,
  selectCartTotalPrice,
  clearCart,
  selectIsCartUpdating,
} from '../features/cart/cartSlice';
import CartItem from '../components/cart/CartItem';

export default function BasketPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartLineItems);
  console.log(items);
  const totalPrice = useSelector(selectCartTotalPrice);
  const isUpdating = useSelector(selectIsCartUpdating);

  return (
    <Box w="100%" maxW="800px" mx="auto" p={4} position="relative">
      {isUpdating && (
        <Spinner
          size="xl"
          thickness="4px"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={1}
        />
      )}
      <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center">
        Delivery Info
      </Text>

      {items.length === 0 ? (
        <Center minH="300px">
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
              Your cart is empty
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center">
              Looks like you have not added anything yet. Start shopping now and
              discover great products!
            </Text>
            <Button
              as={RouterLink}
              to="/products"
              colorScheme="teal"
              size="md"
              variant="solid"
              _hover={{ bg: 'teal.600' }}
            >
              Add products
            </Button>
          </VStack>
        </Center>
      ) : (
        <VStack spacing={6} align="stretch" maxW="800px" w="100%" mx="auto">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <Box textAlign="right" pt={4} fontSize="xl" fontWeight="bold">
            Total:{' '}
            {totalPrice?.centAmount
              ? `${(totalPrice.centAmount / 100).toFixed(2)} ${totalPrice.currencyCode}`
              : '0.00'}
          </Box>
          <HStack justify="flex-end">
            <Button
              colorScheme="red"
              variant="outline"
              size="md"
              onClick={() => dispatch(clearCart())}
              isDisabled={isUpdating}
            >
              Clear Cart
            </Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
}
