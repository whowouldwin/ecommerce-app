import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  Spinner,
  useNumberInput,
  HStack,
  Input,
  Spacer,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Modal,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { Product, Image as ImageSDK } from '@commercetools/platform-sdk';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { getProduct } from '../services';
import ImageBlock from '../components/product-details/ImageBlock.tsx';
import noImage from '../assets/no-image-card.jpg';

const imageNotFound: ImageSDK = {
  url: noImage,
  label: 'no image',
  dimensions: {
    w: 1024,
    h: 1024,
  },
};

const INITIAL_STATE: {
  errorMessage: string;
  productData: Product | null;
  productPrise: string | null;
  productPriseWithDiscount: string | null;
  currencyCode: string;
  isLoading: boolean;
} = {
  errorMessage: '',
  productData: null,
  productPrise: null,
  productPriseWithDiscount: null,
  currencyCode: '',
  isLoading: true,
};

const languageLocal = 'en-US';

const ProductDetailsPage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useState(INITIAL_STATE);
  // const [selectedProduct, setSelectedProduct] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      console.log(id);
      getProduct(id)
        .then((data) => {
          console.log('data.body', data.body);
          const priceObj =
            data.body.masterData.current.masterVariant.prices?.[0];
          const price = priceObj?.value?.centAmount
            ? (
                priceObj.value.centAmount /
                (10 * priceObj.value.fractionDigits)
              ).toFixed(priceObj.value.fractionDigits)
            : null;

          const discountedPrice = priceObj?.discounted?.value?.centAmount
            ? (
                priceObj.discounted.value.centAmount /
                (10 * priceObj?.discounted.value.fractionDigits)
              ).toFixed(priceObj?.discounted.value.fractionDigits)
            : null;

          const currencyCode = priceObj?.value?.currencyCode || 'EUR';
          setState({
            ...state,
            isLoading: false,
            productData: data.body,
            productPrise: price,
            productPriseWithDiscount: discountedPrice,
            currencyCode,
          });
        })
        .catch((error) => {
          console.log('error');
          setState({
            ...state,
            isLoading: false,
            errorMessage: error.body.message,
          });
        });
    }
  }, [id]);

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 500,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  if (state.isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="80vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!state.productData) {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="80vh"
        gap={2}
      >
        <Text fontSize="xl">Product not Found</Text>
        {state.errorMessage && <Text>{state.errorMessage}</Text>}
        <Button
          colorScheme="green"
          size="lg"
          onClick={() => navigate(-1)}
          px={8}
        >
          Go Back
        </Button>
      </Flex>
    );
  }

  const stateImageBlock = (
    imageIndexFromChild: number,
    action: 'open' | 'close',
  ) => {
    console.log('imageIndexFromChild', imageIndexFromChild);
    console.log('imageIndex', imageIndex);
    if (imageIndex !== imageIndexFromChild) {
      setImageIndex(imageIndexFromChild);
    }
    switch (action) {
      case 'close': {
        onClose();
        break;
      }
      case 'open': {
        onOpen();
        break;
      }
    }
  };

  return (
    <Box px={{ base: 1, md: 4 }} py={{ base: 5, md: 7 }} textAlign="center">
      {state.errorMessage && <Text>error: {state.errorMessage}</Text>}
      {
        <Flex direction="column" justifyContent="center" gap="10px">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap="10px"
            height={{ md: '400px' }}
            p="10px"
            justifyContent="center"
            alignItems="center"
            borderRadius="md"
            boxShadow="rgb(120, 92, 92, 0.34) 0px 1px 2px 0px"
          >
            <ImageBlock
              imageData={
                state.productData.masterData.current.masterVariant.images || [
                  imageNotFound,
                ]
              }
              imageIndexProps={imageIndex}
              callBack={stateImageBlock}
              typeBlock="base"
            />
            <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
              <ModalOverlay />
              <ModalContent bg="black" p={4}>
                <ModalBody
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <ImageBlock
                    imageData={
                      state.productData.masterData.current.masterVariant
                        .images || [imageNotFound]
                    }
                    imageIndexProps={imageIndex}
                    callBack={stateImageBlock}
                    typeBlock="modal"
                  />
                  <IconButton
                    icon={<SmallCloseIcon />}
                    position="absolute"
                    right="0"
                    top="10%"
                    onClick={() => {
                      onClose();
                    }}
                    aria-label="Next image"
                    variant="ghost"
                    color="white"
                    zIndex="1"
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
            <Flex
              direction="column"
              alignItems="center"
              height={{ md: '100%' }}
              flexGrow={{ md: '1' }}
              gap="10px"
              p="10px"
              boxShadow={{ md: 'rgba(120, 92, 92, 0.1) -10px 0px 10px -10px' }}
            >
              <Heading as="h3" size="lg">
                {state.productData.masterData.current.name[languageLocal]}
              </Heading>
              <Spacer />

              {state.productPriseWithDiscount && (
                <Flex gap="10px">
                  <Text fontSize="2xl" color="red.500" fontWeight="bold">
                    {state.productPriseWithDiscount} {state.currencyCode}
                  </Text>
                  <Text
                    fontSize="lg"
                    color="gray.500"
                    textDecoration="line-through"
                  >
                    {state.productPrise} {state.currencyCode}
                  </Text>
                </Flex>
              )}

              {!state.productPriseWithDiscount && (
                <Text fontSize="2xl" fontWeight="bold">
                  {state.productPrise} {state.currencyCode}
                </Text>
              )}

              <Spacer />
              <Text>Select the quantity of goods:</Text>
              <HStack maxW="200px">
                <Button {...inc}>+</Button>
                <Input {...input} textAlign="center" />
                <Button {...dec}>-</Button>
              </HStack>
              <Button
                variant="outline"
                colorScheme="red"
                w={{ base: '200px', md: 'full' }}
              >
                Add to Card
              </Button>
            </Flex>
          </Flex>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Description</Tab>
              <Tab>Delivery</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text>
                  {state.productData?.masterData?.current.description
                    ? state.productData?.masterData?.current.description[
                        languageLocal
                      ]
                    : ''}
                </Text>
              </TabPanel>
              <TabPanel>
                <Flex>
                  <Text>
                    We have super fast delivery of the product, after you place
                    an order for delivery you will be sent a confirmation to
                    email confirming your order, you will also be informed how
                    the delivery will be carried out.
                  </Text>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      }
    </Box>
  );
};

export default ProductDetailsPage;
