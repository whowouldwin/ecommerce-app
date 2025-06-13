import {
  Box,
  Flex,
  HStack,
  Image,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartDiscount, DiscountCode } from '@commercetools/platform-sdk';
import { CopyIcon } from '@chakra-ui/icons';
import { AppDispatch, RootState } from '../store/store.ts';
import {
  fetchCartDiscounts,
  fetchDiscountCodes,
} from '../features/discount/discountSlice.ts';
import CustomToast, { ToastStatus } from '../components/CustomToast.tsx';
import discountSVG from '../assets/discount.svg';

export default function DiscountList() {
  const dispatch = useDispatch<AppDispatch>();
  const { cartDiscounts, discountCodes } = useSelector(
    (state: RootState) => state.discount,
  );
  const toast = useToast();
  const discountBg = useColorModeValue('white', 'gray.800');

  const copyDiscountCodeToClipboard = async (discountCodeText: string) => {
    let message = 'Copied!';
    let status: ToastStatus = 'success';
    try {
      await navigator.clipboard.writeText(discountCodeText);
    } catch (error: unknown) {
      console.log(error);
      message = `Error: code "${discountCodeText}" didn't copied!`;
      status = 'error';
    }
    toast({
      duration: 2000,
      position: 'bottom-right',
      render: ({ onClose }) => (
        <CustomToast message={message} status={status} onClose={onClose} />
      ),
    });
  };

  useEffect(() => {
    dispatch(fetchCartDiscounts());
    dispatch(fetchDiscountCodes());
  }, []);

  return (
    <Box w="100%" maxW="1280px" mx="auto" p={4}>
      <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center">
        {cartDiscounts.length
          ? 'Discount list'
          : 'There are no discounts at the moment'}
      </Text>
      <Flex flexDirection="column" gap={4}>
        {cartDiscounts.map((cartDiscount: CartDiscount) => {
          return (
            <>
              <Flex
                key={cartDiscount.id}
                flexDirection={{ base: 'column', lg: 'row' }}
                justifyContent={{ base: 'column', lg: 'space-between' }}
                borderRadius="xl"
                boxShadow="md"
                bg={discountBg}
                p={4}
                gap={6}
              >
                <HStack alignSelf="center" minW={{ sm: '300px' }}>
                  <Image src={discountSVG} alt="discount image" w={'50px'} />
                  <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    {cartDiscount.name['en-US']}
                  </Text>
                </HStack>
                <Text
                  boxShadow="0px -5px 5px -5px rgba(0, 144, 255, 0.6)"
                  w="100%"
                  textAlign={'center'}
                >
                  {cartDiscount.description?.['en-US'] || ''}
                </Text>
                {discountCodes.map((discountCode: DiscountCode) => {
                  if (
                    discountCode.cartDiscounts.some(
                      (cartDiscountInCode) =>
                        cartDiscountInCode.id === cartDiscount.id,
                    )
                  ) {
                    return (
                      <Tag
                        key={discountCode.key}
                        variant="outline"
                        colorScheme="blue"
                        minW="150px"
                        h="40px"
                        justifyContent="space-between"
                        mx={{ base: 'auto', lg: '0' }}
                      >
                        <TagLabel w="100%">{discountCode.code}</TagLabel>
                        <TagRightIcon
                          onClick={() =>
                            copyDiscountCodeToClipboard(discountCode.code)
                          }
                          as={CopyIcon}
                          cursor="pointer"
                          _hover={{ opacity: '0.7' }}
                        />
                      </Tag>
                    );
                  }
                })}
              </Flex>
            </>
          );
        })}
      </Flex>
    </Box>
  );
}
