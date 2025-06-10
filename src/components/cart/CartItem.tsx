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
import { useDispatch } from 'react-redux';
import type { LineItem } from '@commercetools/platform-sdk';
import { AppDispatch } from '../../store/store';
import {
  changeLineItemQuantity,
  removeLineItem,
} from '../../features/cart/cartSlice';
import { getLocalizedText } from '../../utils/localization';

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

        <VStack align={{ base: 'center', sm: 'start' }} spacing={1} flex="1">
          <Text fontWeight="bold" fontSize="lg">
            {name}
          </Text>
          <Text fontSize="md" color="gray.600" _dark={{ color: 'gray.400' }}>
            {(price / 100).toFixed(2)} {currency}
          </Text>
        </VStack>

        <VStack spacing={2}>
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
              isDisabled={item.quantity === 1}
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
