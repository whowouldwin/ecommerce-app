import { Box } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';

const Logo = () => {
  const logoFilter = useColorModeValue('invert(0)', 'invert(1)');

  return (
    <Box boxSize="40px" mr={3}>
      <img
        src="/favikon.svg"
        alt="Logo"
        style={{ width: '100%', height: '100%', filter: logoFilter }}
      />
    </Box>
  );
};

export default Logo;
