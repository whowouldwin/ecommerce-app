import React from 'react';
import {
  Box,
  Text,
  Link,
  VStack,
  HStack,
  Avatar,
  useColorModeValue,
  ListItem,
  List,
  Heading,
} from '@chakra-ui/react';
import { FaCheckCircle, FaGithub } from 'react-icons/fa';

interface DeveloperCardProps {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  githubUrl: string;
  contributions?: string[];
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({
  name,
  role,
  bio,
  photoUrl,
  githubUrl,
  contributions,
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
      h="100%"
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
        {contributions && contributions.length > 0 && (
          <Box w="100%" mt={4} textAlign="left">
            <Heading size="sm" mb={2}>
              Contributions
            </Heading>
            <List spacing={3} fontSize="sm" color={textColor}>
              {contributions.map((item, idx) => (
                <ListItem
                  key={idx}
                  display="flex"
                  alignItems="flex-start"
                  gap={2}
                >
                  <Box mt="6px">
                    <FaCheckCircle color="green" size={14} />
                  </Box>
                  <Text as="span">{item}</Text>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default DeveloperCard;
