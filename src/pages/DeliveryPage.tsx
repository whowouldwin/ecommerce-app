import { Box, Center, Text } from '@chakra-ui/react';
import CartTester from '../components/cart/CartTester.tsx';

export default function DeliveryPage() {
  return (
    <Box
      w="100%"
      minH="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Center>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="primary"
          _dark={{ color: 'brand.300' }}
        >
          Delivery Info
        </Text>
      </Center>
      <CartTester />
    </Box>
  );
}
