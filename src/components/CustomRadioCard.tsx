import React from 'react';
import {
  useRadio,
  Box,
  UseRadioProps,
  useColorModeValue,
} from '@chakra-ui/react';

export function CustomRadioCard(
  props: UseRadioProps & { children: React.ReactNode },
) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  const checkedBg = useColorModeValue('brand.50', 'brand.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const baseBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('brand.400', 'brand.300');
  const hoverBorderColor = useColorModeValue('brand.300', 'brand.500');

  return (
    <Box as="label" w="100%">
      <input {...input} hidden />
      <Box
        {...checkbox}
        bg={baseBg}
        borderWidth="2px"
        borderRadius="md"
        p={1}
        w="100%"
        cursor="pointer"
        _checked={{
          bg: checkedBg,
          borderColor: borderColor,
          boxShadow: 'md',
        }}
        _hover={{
          bg: hoverBg,
          borderColor: hoverBorderColor,
        }}
        transition="all 0.2s"
      >
        {props.children}
      </Box>
    </Box>
  );
}
