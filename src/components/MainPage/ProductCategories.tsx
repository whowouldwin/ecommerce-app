import {
  Box,
  Image,
  Text,
  Heading,
  SimpleGrid,
  Button,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Category } from '@commercetools/platform-sdk';
import { getLocalizedText } from '../../utils/localization.ts';
import {
  fetchCategories,
  setSelectedCategoryKey,
} from '../../features/category/categorySlice';
import { AppDispatch, RootState } from '../../store/store';

import flowerBA from '../../assets/flower-b-a.png';
import flowerCB from '../../assets/classic-b.png';
import flowerRoses from '../../assets/flower-roses.png';
import flowerSF from '../../assets/flower-s-f.png';
import defaultImg from '../../assets/default.png';

const categoryImages: Record<string, string> = {
  'flower-b-a': flowerBA,
  'classic-b': flowerCB,
  'flower-roses': flowerRoses,
  'flower-s-f': flowerSF,
};

const getImageUrl = (cat: Category): string => {
  const key = cat.key?.toLowerCase() || 'default';
  return categoryImages[key] || defaultImg;
};

const ProductCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category,
  );

  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const overlayBg = useColorModeValue('rgba(0,0,0,0.65)', 'rgba(0,0,0,0.6)');
  const overlayText = useColorModeValue('white', 'white');

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  if (loading) {
    return <Text px={4}>Loading categories...</Text>;
  }

  if (error) {
    return (
      <Text px={4} color="red.500">
        Error loading categories: {error}
      </Text>
    );
  }

  return (
    <Box
      maxW="container.xl"
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={{ base: 10, md: 16 }}
    >
      <Heading
        as="h2"
        size="lg"
        mb={8}
        fontFamily="'Poppins', sans-serif"
        color={headingColor}
      >
        Product Categories
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {categories
          .filter((cat) => !cat.parent)
          .map((cat) => {
            const title = getLocalizedText(cat.name);
            const description = getLocalizedText(cat.description);
            const imgSrc = getImageUrl(cat);

            return (
              <Box
                key={cat.id}
                bg={cardBg}
                borderRadius="md"
                overflow="hidden"
                shadow="md"
                display="flex"
                flexDirection="column"
              >
                <Box position="relative" w="100%" pt="100%">
                  <Image
                    src={imgSrc}
                    alt={title}
                    objectFit="cover"
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                  />
                  <Box
                    position="absolute"
                    bottom="0"
                    w="100%"
                    bg={overlayBg}
                    color={overlayText}
                    px={4}
                    py={2}
                    fontWeight="semibold"
                    fontSize="md"
                    textTransform="uppercase"
                    isTruncated
                  >
                    {title}
                  </Box>
                </Box>

                <Flex direction="column" p={4} flex="1">
                  <Text
                    fontSize="sm"
                    color={textColor}
                    mb={4}
                    fontFamily="'Poppins', sans-serif"
                  >
                    {description}
                  </Text>

                  <Button
                    mt="auto"
                    size="sm"
                    colorScheme="orange"
                    fontWeight="medium"
                    alignSelf="flex-start"
                    onClick={() => {
                      dispatch(setSelectedCategoryKey(cat.key ?? null));
                      navigate('/products');
                    }}
                  >
                    See More
                  </Button>
                </Flex>
              </Box>
            );
          })}
      </SimpleGrid>

      <Flex justify="center" mt={10}>
        <Button
          size="md"
          colorScheme="blue"
          onClick={() => {
            dispatch(setSelectedCategoryKey(null));
            navigate('/products');
          }}
        >
          Show All
        </Button>
      </Flex>
    </Box>
  );
};

export default ProductCategories;
