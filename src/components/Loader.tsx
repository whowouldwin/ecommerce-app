import { Box, Spinner } from '@chakra-ui/react';

const Loader = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bg="rgba(255, 255, 255, 0.8)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="xl" color="pink.500" />
    </Box>
  );
};

export default Loader;
