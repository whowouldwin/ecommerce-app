import {
  Button,
  Flex,
  HStack,
  Input,
  Tag,
  TagLabel,
  TagRightIcon,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CloseIcon } from '@chakra-ui/icons';
import { AppDispatch } from '../../store/store.ts';
import {
  applyDiscountCode,
  removeDiscountCode,
  selectCartPromoCodes,
} from '../../features/cart/cartSlice.ts';
import { useAppSelector } from '../../store/hooks.ts';
import {
  fetchDiscountCodes,
  selectDiscountCodes,
} from '../../features/discount/discountSlice.ts';

const PromoCodeBlock = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchDiscountCodes());
  }, []);
  const [promoCodeInputValue, setPromoCodeInputValue] = useState('');
  const toast = useToast();
  const appliedPromoCodesArray = useAppSelector(selectCartPromoCodes);
  const promoCodesArray = useAppSelector(selectDiscountCodes);
  const promoCodesList = appliedPromoCodesArray
    ? promoCodesArray.filter((promoCode) =>
        appliedPromoCodesArray.some(
          (appliedPromoCode) =>
            appliedPromoCode.discountCode.id === promoCode.id,
        ),
      )
    : [];

  const handleApplyPromo = () => {
    if (!promoCodeInputValue.trim()) return;
    dispatch(applyDiscountCode(promoCodeInputValue.trim()))
      .unwrap()
      .then(() => {
        toast({
          title: 'Promo code applied!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: 'Failed to apply promo code',
          description: err,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleRemovePromo = (id: string) => {
    dispatch(removeDiscountCode(id))
      .unwrap()
      .then(() => {
        toast({
          title: 'Promo code removed!',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        setPromoCodeInputValue('');
      })
      .catch((err) => {
        toast({
          title: 'Failed to remove promo code',
          description: err,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };
  return (
    <Flex flexDirection="column" gap="10px">
      <HStack>
        <Input
          placeholder="Enter promo code"
          value={promoCodeInputValue}
          onChange={(e) => setPromoCodeInputValue(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleApplyPromo}>
          Apply
        </Button>
      </HStack>
      <Flex
        gap="10px"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        flexWrap="wrap"
      >
        {promoCodesList.map((promoCode) => (
          <Tag
            key={promoCode.key}
            variant="outline"
            colorScheme="blue"
            minW="150px"
            h="40px"
            justifyContent="space-between"
            mx={{ base: 'auto', lg: '0' }}
          >
            <TagLabel w="100%">{promoCode.code}</TagLabel>
            <TagRightIcon
              onClick={() => handleRemovePromo(promoCode.id)}
              as={CloseIcon}
              cursor="pointer"
              _hover={{ opacity: '0.7' }}
            />
          </Tag>
        ))}
      </Flex>
    </Flex>
  );
};
export default PromoCodeBlock;
