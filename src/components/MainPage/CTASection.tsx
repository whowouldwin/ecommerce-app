import {
  Box,
  Text,
  Heading,
  SimpleGrid,
  VStack,
  Icon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHeart, FaGift, FaSeedling } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const features = [
  {
    icon: FaLeaf,
    title: 'Seasonal Bouquets',
    description: 'Inspired by nature, handcrafted with care.',
  },
  {
    icon: FaHeart,
    title: 'Wedding Flowers',
    description: 'Elegant arrangements for your special day.',
  },
  {
    icon: FaSeedling,
    title: 'Green Plants',
    description: 'Add a breath of life to your home or office.',
  },
  {
    icon: FaGift,
    title: 'Gift Delivery',
    description: 'Surprise someone you love with fresh flowers.',
  },
];

const CTASection = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );
  const headingColor = useColorModeValue('gray.900', 'white');
  const iconColor = useColorModeValue('black', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box px={{ base: 4, md: 16 }} py={{ base: 20, md: 28 }} textAlign="center">
      <Heading
        as="h2"
        fontSize={{ base: '2xl', md: '4xl' }}
        mb={20}
        fontWeight="medium"
        fontFamily="'Poppins', sans-serif"
        lineHeight="1.3"
        color={headingColor}
      >
        We create floral <br />
        experiences for your most <br />
        meaningful moments
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8} mb={20}>
        {features.map((feature, index) => (
          <Box key={index} mb={{ base: 12, md: 0 }}>
            <VStack
              spacing={6}
              align={{ base: 'center', md: 'start' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Icon as={feature.icon} boxSize={10} color={iconColor} />
              <Text
                fontSize="lg"
                fontWeight="medium"
                fontFamily="'Poppins', sans-serif"
                color={headingColor}
              >
                {feature.title}
              </Text>
              <Text
                fontSize="sm"
                color={textColor}
                fontFamily="'Poppins', sans-serif"
              >
                {feature.description}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {!isLoggedIn && (
        <Link to="/register">
          <Button
            size="lg"
            colorScheme="green"
            fontWeight="semibold"
            fontFamily="'Poppins', sans-serif"
            _hover={{
              bg: 'green.600',
              transform: 'scale(1.02)',
              boxShadow: 'md',
            }}
            transition="all 0.2s ease-in-out"
          >
            Register Now
          </Button>
        </Link>
      )}
    </Box>
  );
};

export default CTASection;
