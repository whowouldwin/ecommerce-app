import { Box, Badge, IconButton } from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../store/hooks.ts';
import { selectCartItemCount } from '../features/cart/cartSlice.ts';

const BasketIconButton = () => {
  const itemCount = useAppSelector(selectCartItemCount);

  return (
    <Box position="relative">
      <IconButton
        as={RouterLink}
        to="/basket"
        aria-label="Basket"
        icon={<FaShoppingCart />}
        variant="ghost"
        colorScheme="brand"
      />

      {itemCount > 0 && (
        <Badge
          position="absolute"
          top="-1"
          right="-1"
          rounded="full"
          px={2}
          fontSize="xs"
          bg="secondary"
          color="white"
          pointerEvents="none"
        >
          {itemCount}
        </Badge>
      )}
    </Box>
  );
};

export default BasketIconButton;
