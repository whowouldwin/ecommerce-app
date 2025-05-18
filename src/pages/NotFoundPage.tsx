import React from 'react';
import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  VStack,
  useColorModeValue,
  Flex,
  Container,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import notFoundPage from '../assets/404.png';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const bg = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box minH="100vh" bg={bg}>
      <Header />
      <Container
        maxW="container.lg"
        p={{ base: 6, md: 10 }}
        py={16}
        mt={{ base: 8, md: 4 }}
        boxShadow="lg"
        position="relative"
        border="1px solid"
        borderRadius="2xl"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="center"
          px={8}
          py={16}
          gap={6}
        >
          <VStack align="start" spacing={10} maxW="md" w="100%" flex="1">
            <Heading fontSize="6xl" color="black.600">
              Ooops...
            </Heading>
            <Text fontSize="4xl" color={textColor}>
              Page not found
            </Text>
            <Button
              colorScheme="green"
              size="lg"
              onClick={() => navigate(-1)}
              px={8}
            >
              Go Back
            </Button>
          </VStack>
          <Box maxW="lg" flex="1">
            <Image
              src={notFoundPage}
              alt="Page not found"
              objectFit="contain"
              w="100%"
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
