import {
  Box,
  Center,
  Text,
  VStack,
  Button,
  HStack,
  Flex,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import {
  clearCart,
  selectCartLineItems,
  selectIsCartUpdating,
} from '../features/cart/cartSlice';
import CartItem from '../components/cart/CartItem';
import TotalOrderContainer from '../components/cart/TotalOrderContainer.tsx';
import { AppDispatch } from '../store/store.ts';

export default function BasketPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartLineItems);
  const isUpdating = useSelector(selectIsCartUpdating);
  const [isShowConfirmationDeleting, setIsShowConfirmationDeleting] =
    useState(false);

  return (
    <Box w="100%" maxW="1200px" mx="auto" p={4} position="relative">
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

      {!items.length && (
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
      )}

      {!!items.length && (
        <Flex flexDirection={{ base: 'column', mdl: 'row' }} gap="10px">
          <VStack spacing={6} align="stretch" maxW="800px" w="100%" mx="auto">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </VStack>
          <Flex flexDirection="column" gap="10px">
            <TotalOrderContainer />
            <HStack justify="center">
              {!isShowConfirmationDeleting && (
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsShowConfirmationDeleting(true);
                  }}
                  isDisabled={isUpdating}
                  w="100%"
                >
                  Clear Cart
                </Button>
              )}
              {isShowConfirmationDeleting && (
                <HStack px={2}>
                  <Text>Are you sure to empty the cart?</Text>
                  <IconButton
                    colorScheme="green"
                    variant="outline"
                    aria-label="confirm"
                    icon={<CheckIcon />}
                    onClick={() => {
                      dispatch(clearCart());
                      setIsShowConfirmationDeleting(false);
                    }}
                  ></IconButton>
                  <IconButton
                    colorScheme="red"
                    variant="outline"
                    aria-label="cancel"
                    icon={<CloseIcon />}
                    onClick={() => {
                      setIsShowConfirmationDeleting(false);
                    }}
                  ></IconButton>
                </HStack>
              )}
            </HStack>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
