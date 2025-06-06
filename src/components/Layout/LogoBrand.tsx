import { Box, Flex, Image, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const LogoBrand = () => {
  return (
    <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
      <Flex align="center" gap={3}>
        <Image src={logo} alt="Logo" height="40px" className="logo" />
        <Box lineHeight="short" color="primary" _dark={{ color: 'brand.300' }}>
          <Box fontWeight="bold">FLR</Box>
          <Box fontSize="sm" display={{ base: 'none', md: 'block' }}>
            Product Customers Pr
          </Box>
        </Box>
      </Flex>
    </ChakraLink>
  );
};

export default LogoBrand;
