import { extendTheme, ThemeConfig, StyleFunctionProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#F0FFF4',
      100: '#C6F6D5',
      200: '#9AE6B4',
      300: '#68D391',
      400: '#48BB78',
      500: '#38A169',
      600: '#2F855A',
      700: '#276749',
      800: '#22543D',
      900: '#1C4532',
    },
    primary: {
      50: '#667085',
      100: '#393126',
      200: '#2F281E',
      300: '#101828',
      400: '#E9E9F2',
    },
    secondary: '#D6850C',
    accent: '#FFB2A0',
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      html: {
        height: '100%',
      },
      body: {
        minHeight: '100vh',
        bg: mode('white', 'gray.900')(props),
        color: mode('gray.800', 'gray.100')(props),
      },
      '#root': {
        height: '100%',
      },
    }),
  },
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          bg: mode('white', 'gray.700'),
          borderColor: mode('gray.300', 'gray.600'),

          _checked: {
            bg: 'brand.500',
            borderColor: 'brand.500',
            _hover: {
              bg: 'brand.600',
              borderColor: 'brand.600',
            },
          },
          _hover: {
            bg: mode('brand.100', 'gray.600'),
            borderColor: mode('brand.300', 'gray.500'),
          },
        },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
  },
});

export default theme;
