import React from 'react';
import {
  Box,
  Text,
  Link,
  VStack,
  HStack,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

interface DeveloperCardProps {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  githubUrl: string;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({
  name,
  role,
  bio,
  photoUrl,
  githubUrl,
}) => {
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      boxShadow="md"
      p={6}
      w="100%"
      maxW="sm"
      textAlign="center"
    >
      <VStack spacing={4}>
        <Avatar size="xl" name={name} src={photoUrl} />
        <Box>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            {name}
          </Text>
          <Text fontSize="md" color="gray.500">
            {role}
          </Text>
        </Box>
        <Text fontSize="sm" color={textColor}>
          {bio}
        </Text>
        <HStack spacing={3} justify="center">
          <Link href={githubUrl} isExternal aria-label={`${name}'s GitHub`}>
            <FaGithub size="24" />
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default DeveloperCard;
