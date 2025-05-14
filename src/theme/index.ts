import { extendTheme, ThemeConfig, StyleFunctionProps } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

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
    heading: `'Montserrat', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
  components: {
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
})

export default theme
