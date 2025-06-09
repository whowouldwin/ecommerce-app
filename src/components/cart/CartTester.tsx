import {
  VStack,
  HStack,
  Text,
  Image,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  selectCartLineItems,
  changeLineItemQuantity,
  removeLineItem,
} from '../../features/cart/cartSlice';
import { getLocalizedText } from '../../utils/localization.ts';

const CartTester = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartLineItems);

  if (items.length === 0) return <Text color="gray.400">Cart is empty</Text>;

  const locale = 'en-US';

  return (
    <VStack align="stretch" spacing={4} maxW="sm">
      {items.map((li) => {
        const imgSrc = li.variant?.images?.[0]?.url;
        const name = getLocalizedText(li.name, locale);

        const decrease = () =>
          dispatch(
            changeLineItemQuantity({
              lineItemId: li.id,
              quantity: li.quantity - 1,
            }),
          );

        return (
          <VStack key={li.id} align="stretch" spacing={2}>
            <HStack justify="space-between">
              <HStack>
                {imgSrc && (
                  <Image
                    src={imgSrc}
                    alt={name}
                    boxSize="40px"
                    borderRadius="md"
                  />
                )}
                <Text>{name}</Text>
              </HStack>

              <HStack>
                <IconButton
                  size="xs"
                  aria-label="Decrease quantity"
                  icon={<MinusIcon />}
                  onClick={decrease}
                  isDisabled={li.quantity === 0}
                />
                <Text>{li.quantity}</Text>
                <IconButton
                  size="xs"
                  aria-label="Increase quantity"
                  icon={<AddIcon />}
                  onClick={() =>
                    dispatch(
                      changeLineItemQuantity({
                        lineItemId: li.id,
                        quantity: li.quantity + 1,
                      }),
                    )
                  }
                />
              </HStack>

              <IconButton
                size="xs"
                aria-label="Remove item"
                icon={<DeleteIcon />}
                onClick={() => dispatch(removeLineItem({ lineItemId: li.id }))}
              />
            </HStack>
            <Divider />
          </VStack>
        );
      })}
    </VStack>
  );
};

export default CartTester;
