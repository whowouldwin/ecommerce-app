import { Box, Center, Text } from '@chakra-ui/react'

export default function AboutPage() {
  return (
    <Box w="100%" minH="70vh" display="flex" alignItems="center" justifyContent="center">
      <Center>
        <Text fontSize="2xl" fontWeight="bold" color="primary" _dark={{ color: 'brand.300' }}>
          About Us
        </Text>
      </Center>
    </Box>
  )
}
