import { Button, Box, Text, IconButton } from '@chakra-ui/react';
import { MinusIcon, AddIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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
  const [debounceTimer, setDebounceTimer] = useState(0);

  const [productQty, setProductQty] = useState(lineItem?.quantity ?? 0);
  useEffect(() => {
    setProductQty(lineItem?.quantity ?? 0);
  }, [lineItem?.quantity]);

  const debouncedCounterFunc: (qty: number) => void = (qty) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timerID = setTimeout(() => {
      dispatch(
        changeLineItemQuantity({ lineItemId: lineItem!.id, quantity: qty }),
      );
    }, 300);
    setDebounceTimer(timerID);
  };

  const handleAdd = () =>
    dispatch(addLineItem({ productId, variantId, quantity: 1 }));
  const handlePlus = () => {
    const value = productQty + 1;
    setProductQty(value);
    debouncedCounterFunc(value);
  };

  const handleMinus = () => {
    const value = productQty - 1;
    setProductQty(value);
    debouncedCounterFunc(value);
  };

  if (productQty === 0) {
    return (
      <Button colorScheme="green" size="sm" onClick={handleAdd}>
        Add&nbsp;to&nbsp;Cart
      </Button>
    );
  }

  return (
    <Box
      whiteSpace="nowrap"
      gap={2}
      justifyContent="space-between"
      display="flex"
      alignItems="center"
      w="full"
    >
      <IconButton
        aria-label="Decrease"
        icon={<MinusIcon />}
        size="xs"
        onClick={handleMinus}
        isDisabled={productQty === 0}
      />
      <Text fontWeight="semibold">{productQty}</Text>
      <IconButton
        aria-label="Increase"
        icon={<AddIcon />}
        size="xs"
        onClick={handlePlus}
      />
    </Box>
  );
};

export default AddToCartButton;
