import {
  SimpleGrid,
  Heading,
  VStack,
  Box,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import DeveloperCard from '../components/AboutUsPage/DeveloperCard';
import leraPhoto from '../assets/images/lera.jpg';
import pavelPhoto from '../assets/images/pavel.jpg';
import ninaPhoto from '../assets/images/nina.jpg';
import rsPhoto from '../assets/images/RS.jpg';

export default function AboutPage() {
  const developers = [
    {
      name: 'Valeryia Bessonava',
      role: 'Frontend Developer',
      bio: 'Develops the interface and is responsible for user interaction.',
      photoUrl: leraPhoto,
      githubUrl: 'https://github.com/whowouldwin',
      contributions: [
        'Designed the complete UI/UX for the application in Figma, including all key pages and components',
        'Structured and implemented the Redux store with feature-based slices: user, category, product, filter, and cart',
        'Built the `ProtectedRoute` component to secure private routes and manage authentication-based access',
      ],
    },
    {
      name: 'Pavel Putyrski',
      role: 'Frontend Developer',
      bio: 'Creates and maintains the server part of the application.',
      photoUrl: pavelPhoto,
      githubUrl: 'https://github.com/privatepython',
    },
    {
      name: 'Nina Yeulash',
      role: 'Frontend Developer',
      bio: 'Develops the interface and is responsible for user interaction.',
      photoUrl: ninaPhoto,
      githubUrl: 'https://github.com/ninaevlash',
    },
  ];

  return (
    <VStack spacing={8} align="stretch">
      <Heading as="h2" size="xl" textAlign="center">
        About Us
      </Heading>

      <Box maxW="6xl" mx="auto" px={4}>
        <Text
          fontSize="lg"
          textAlign="justify"
          lineHeight="tall"
          color="gray.600"
          _dark={{ color: 'gray.300' }}
        >
          Welcome! We’re a group of aspiring frontend developers passionate
          about building modern, responsive, and user-friendly web applications.
          Currently, we’re sharpening our skills through the RS School course.
          This website is part of our journey: a space where we practice,
          explore, and bring ideas to life using HTML, CSS, JavaScript, React,
          and other cutting-edge technologies. Our goal? To become not just
          coders, but creators — developers who build with purpose, clarity, and
          care. We’re glad you’re here.
        </Text>
      </Box>

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {developers.map((dev, index) => (
          <DeveloperCard key={index} {...dev} />
        ))}
      </SimpleGrid>

      <Box pt={5} textAlign="center">
        <Text
          fontSize="md"
          color="gray.500"
          mb={2}
          _dark={{ color: 'gray.400' }}
        >
          This project was completed as part of a training course
          JavaScript/Front-end 2024Q4
          <Link href="https://rs.school" isExternal color="teal.500" ml={2}>
            RS School
          </Link>
        </Text>
        <Link href="https://rs.school" isExternal>
          <Image
            src={rsPhoto}
            alt="RS School Logo"
            mx="auto"
            h={24}
            w={24}
            borderRadius="full"
            objectFit="cover"
            _hover={{
              transform: 'scale(1.1)',
              transition: 'transform 0.3s ease',
            }}
          />
        </Link>
      </Box>
    </VStack>
  );
}
