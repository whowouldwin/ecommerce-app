import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { getME } from '../services';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../features/user/userSlice';

const UserStatus = () => {
  const user = useAppSelector(selectUser);

  return (
    <Center>
      <VStack spacing={4}>
        <Heading fontSize="3xl" color="primary.500">
          Welcome to our flower shop!
        </Heading>

        <Button
          onClick={() =>
            getME()
              .then((data) => console.log('User data is:', data))
              .catch((error) => console.log("User data doesn't found", error))
          }
          colorScheme="teal"
          size="sm"
        >
          Get Me
        </Button>

        <Text fontSize="md">
          Status:{' '}
          {user.isAuthenticated
            ? `Logged in as ${user.email}`
            : 'Not logged in'}
        </Text>
      </VStack>
    </Center>
  );
};

export default UserStatus;
