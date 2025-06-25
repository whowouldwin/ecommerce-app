import {
  HStack,
  VStack,
  Text,
  Image,
  IconButton,
  Box,
  Flex,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { LineItem } from '@commercetools/platform-sdk';
import { AppDispatch } from '../../store/store';
import {
  changeLineItemQuantity,
  removeLineItem,
  selectIsCartUpdating,
} from '../../features/cart/cartSlice';
import { getLocalizedText } from '../../utils/localization';
import { formatPrice } from '../../utils/price.ts';

interface CartItemProps {
  item: LineItem;
  locale?: string;
}

const CartItem = ({ item, locale = 'en-US' }: CartItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const name = getLocalizedText(item.name, locale);
  const imgSrc = item.variant?.images?.[0]?.url;
  const price = item.totalPrice?.centAmount ?? 0;
  const currency = item.totalPrice?.currencyCode ?? '';
  const isUpdating = useSelector(selectIsCartUpdating);
  const itemPrice = formatPrice(
    item.price.value.centAmount,
    item.price.value.currencyCode,
  );
  const itemDiscountedPrice =
    item.price.discounted &&
    formatPrice(
      item.price.discounted.value.centAmount,
      item.price.discounted.value.currencyCode,
    );

  return (
    <Box
      w="100%"
      maxW="800px"
      mx="auto"
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      border="1px solid"
      borderColor="gray.200"
      _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
    >
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={4}
        align={{ base: 'center', sm: 'center' }}
      >
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={name}
            boxSize="80px"
            objectFit="cover"
            borderRadius="md"
          />
        )}

        <VStack
          align={{ base: 'center', sm: 'start' }}
          mb={{ base: '15px', sm: '0' }}
          spacing={1}
          flex="1"
        >
          <Text fontWeight="bold" fontSize="lg">
            {name}
          </Text>
          {itemDiscountedPrice ? (
            <HStack>
              <Text fontWeight="bold" color="red.500">
                {itemDiscountedPrice}
              </Text>
              <Text as="s" color="gray.500" fontSize="sm">
                {itemPrice}
              </Text>
            </HStack>
          ) : (
            <Text fontWeight="bold" color="green.500">
              {itemPrice}
            </Text>
          )}
        </VStack>

        <VStack spacing={4}>
          <Text
            px={4}
            boxShadow="0px 5px 5px -5px rgb(197, 48, 48)"
            fontSize="md"
            color="gray.600"
            _dark={{ color: 'gray.400' }}
          >
            {(price / 100).toFixed(2)} {currency}
          </Text>
          <HStack>
            <IconButton
              size="sm"
              icon={<MinusIcon />}
              aria-label="Decrease quantity"
              onClick={() =>
                dispatch(
                  changeLineItemQuantity({
                    lineItemId: item.id,
                    quantity: item.quantity - 1,
                  }),
                )
              }
              isDisabled={isUpdating || item.quantity === 1}
              variant="outline"
              colorScheme="gray"
            />
            <Text>{item.quantity}</Text>
            <IconButton
              size="sm"
              icon={<AddIcon />}
              aria-label="Increase quantity"
              onClick={() =>
                dispatch(
                  changeLineItemQuantity({
                    lineItemId: item.id,
                    quantity: item.quantity + 1,
                  }),
                )
              }
              isDisabled={isUpdating}
              variant="outline"
              colorScheme="gray"
            />
            <Box ml={4}>
              <IconButton
                size="sm"
                icon={<DeleteIcon />}
                aria-label="Remove item"
                onClick={() =>
                  dispatch(removeLineItem({ lineItemId: item.id }))
                }
                isDisabled={isUpdating}
                colorScheme="red"
                variant="outline"
              />
            </Box>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  );
};

export default CartItem;
