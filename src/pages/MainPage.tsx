import { Box, Center, Text } from '@chakra-ui/react';

const MainPage = () => {
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
          Welcome to our flower shop website!
        </Text>
      </Center>
    </Box>
  );
};

export default MainPage;
