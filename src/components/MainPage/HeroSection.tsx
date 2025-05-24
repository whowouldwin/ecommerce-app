import { Box, Heading, Text, Flex, Image } from '@chakra-ui/react';
import girl from '../../assets/girl.png';

const HeroSection = () => {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} align="center" py={10}>
      <Box flex="1" textAlign={{ base: 'center', md: 'left' }} px={6}>
        <Heading as="h1" size="2xl" mb={4}>
          Bringing Emotions to Life Through Flowers
        </Heading>
        <Text fontSize="lg">
          Bouquets for every occasion — made with love and delivered with care.
        </Text>
      </Box>
      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        mt={{ base: 8, md: 0 }}
      >
        <Image src={girl} alt="Flower Girl" maxW="300px" />
      </Box>
    </Flex>
  );
};

export default HeroSection;
