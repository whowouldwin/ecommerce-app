import {
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { TypedMoney } from '@commercetools/platform-sdk';
import { useNavigate } from 'react-router-dom';
import {
  clearCart,
  selectCartDiscountOnTotalPrice,
  selectCartItemCount,
  selectCartTotalPrice,
} from '../../features/cart/cartSlice.ts';
import { useAppSelector } from '../../store/hooks.ts';
import PromoCodeBlock from './PromoCodeBlock.tsx';
import { AppDispatch } from '../../store/store.ts';

function getPriceFromObjectPrice(priceObj: TypedMoney) {
  return priceObj.centAmount / 10 ** priceObj.fractionDigits;
}

const TotalOrderContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const itemCount = useAppSelector(selectCartItemCount);
  const totalPriceObject = useSelector(selectCartTotalPrice);
  const discountOnTotalPriceObject = useSelector(
    selectCartDiscountOnTotalPrice,
  );

  const totalPrice = totalPriceObject
    ? getPriceFromObjectPrice(totalPriceObject)
    : 0;
  const totalDiscount =
    discountOnTotalPriceObject &&
    getPriceFromObjectPrice(discountOnTotalPriceObject.discountedAmount);
  const totalPriceWithoutDiscount = totalDiscount && totalPrice + totalDiscount;

  return (
    <Flex
      flexDirection="column"
      p={2}
      h="fit-content"
      minW={{ md: '320px' }}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      border="1px solid"
      borderColor="gray.200"
      _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
      gap="10px"
    >
      <HStack
        justifyContent="space-between"
        gap="10px"
        alignItems="center"
        p={2}
        fontSize="xl"
        fontWeight="bold"
        boxShadow="0px 5px 5px -5px rgb(197, 48, 48)"
      >
        <Text>Total amount:</Text>
        <Text whiteSpace="nowrap">
          {totalPrice
            ? `${totalPrice.toFixed(totalPriceObject?.fractionDigits || 2)} ${totalPriceObject?.currencyCode || 'EUR'}`
            : '0.00'}
        </Text>
      </HStack>

      <HStack
        justifyContent="space-between"
        gap="10px"
        alignItems="center"
        p={2}
        fontSize="md"
        fontWeight="bold"
      >
        <Text>Goods in the basket:</Text>
        <Text whiteSpace="nowrap">{itemCount + ' item'}</Text>
      </HStack>
      {totalPriceWithoutDiscount && (
        <>
          <HStack
            justifyContent="space-between"
            gap="10px"
            alignItems="center"
            p={2}
            fontSize="md"
            fontWeight="bold"
          >
            <Text>Total amount without a discount:</Text>
            <Text textDecoration="line-through" whiteSpace="nowrap">
              {totalPriceWithoutDiscount.toFixed(2) +
                ' ' +
                discountOnTotalPriceObject.discountedAmount.currencyCode}
            </Text>
          </HStack>

          <HStack
            justifyContent="space-between"
            gap="10px"
            alignItems="center"
            p={2}
            fontSize="md"
            fontWeight="thin"
            color="red.500"
          >
            <Text>Your discount:</Text>
            <Text whiteSpace="nowrap">
              {totalDiscount.toFixed(2) +
                ' ' +
                discountOnTotalPriceObject.discountedAmount.currencyCode}
            </Text>
          </HStack>
        </>
      )}
      <PromoCodeBlock />
      <Button
        variant="solidRed"
        size="md"
        onClick={() => {
          onOpen();
        }}
        w="100%"
      >
        Buy
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          dispatch(clearCart());
          onClose();
          navigate('/');
        }}
        size="4xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="black" p={4} w={'80%'} h={'80%'}>
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="20px"
          >
            <Heading>Your order has been successfully placed!</Heading>
            <Text>
              Our manager will check your order and send a message with further
              actions to your email
            </Text>
            <Button
              onClick={() => {
                dispatch(clearCart());
                onClose();
                navigate('/');
              }}
            >
              go to home page
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default TotalOrderContainer;
