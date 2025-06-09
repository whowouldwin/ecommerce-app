import { Button, HStack, Text, IconButton } from '@chakra-ui/react';
import { MinusIcon, AddIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store/store';
import {
  addLineItem,
  changeLineItemQuantity,
  selectCartLineItems,
} from '../features/cart/cartSlice';

type Props = {
  productId: string;
  variantId: number;
};

const AddToCartButton = ({ productId, variantId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const lineItem = useSelector(selectCartLineItems).find(
    (li) => li.productId === productId && li.variant.id === variantId,
  );
  const qty = lineItem?.quantity ?? 0;

  const handleAdd = () =>
    dispatch(addLineItem({ productId, variantId, quantity: 1 }));
  const handlePlus = () =>
    dispatch(
      changeLineItemQuantity({ lineItemId: lineItem!.id, quantity: qty + 1 }),
    );
  const handleMinus = () =>
    dispatch(
      changeLineItemQuantity({ lineItemId: lineItem!.id, quantity: qty - 1 }),
    );

  if (qty === 0) {
    return (
      <Button colorScheme="green" size="sm" onClick={handleAdd}>
        Add&nbsp;to&nbsp;Cart
      </Button>
    );
  }

  return (
    <HStack spacing={2}>
      <IconButton
        aria-label="Decrease"
        icon={<MinusIcon />}
        size="xs"
        onClick={handleMinus}
        isDisabled={qty === 0}
      />
      <Text fontWeight="semibold">{qty}</Text>
      <IconButton
        aria-label="Increase"
        icon={<AddIcon />}
        size="xs"
        onClick={handlePlus}
      />
    </HStack>
  );
};

export default AddToCartButton;
