import { Box, Heading, Text, Flex, Image } from '@chakra-ui/react';
import girl from '../../assets/girl.png';

const HeroSection = () => {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align="center"
      justify="space-between"
      py={{ base: 20, md: 32 }}
      gap={12}
      bg="white"
    >
      <Box flex="1" textAlign={{ base: 'center', md: 'left' }}>
        <Heading
          as="h2"
          size="2xl"
          mb={12}
          fontWeight="bold"
          lineHeight="1.2"
          fontFamily="'Poppins', sans-serif"
        >
          Bringing Emotions <br />
          to Life Through Flowers
        </Heading>
        <Text fontSize="lg" mb={6} fontFamily="'Poppins', sans-serif">
          Bouquets for every occasion — made with love and delivered with care.
        </Text>
      </Box>
      <Box flex="1" display="flex" justifyContent="center">
        <Image src={girl} alt="Flower Girl" maxW="100%" maxH="360px" />
      </Box>
    </Flex>
  );
};

export default HeroSection;
