import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { loginUser } from '../features/user/userSlice';
import CustomToast from '../components/CustomToast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields!');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter correct email!');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long!');
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        toast({
          duration: 3000,
          isClosable: true,
          position: 'top-left',
          render: ({ onClose }) => (
            <CustomToast
              message="Logged in successfully!"
              onClose={onClose}
              status="success"
            />
          ),
        });
        navigate(location.state?.from || '/', { replace: true });
      } else {
        setError('Login failed: Invalid credentials');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Unknown error occurred. Try again!');
      }
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={20}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg={useColorModeValue('white', 'gray.700')}
      color={useColorModeValue('gray.800', 'white')}
    >
      <VStack as="form" spacing={5} onSubmit={handleSubmit}>
        <Heading
          color="primary.300"
          _dark={{ color: 'brand.300' }}
          as="h2"
          size="lg"
          mb={4}
        >
          Sign In to FLR
        </Heading>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}

        <Button colorScheme="blue" type="submit" width="full">
          Sign In
        </Button>
        <Text fontSize="sm">
          Don’t have an account?{' '}
          <Link to="/register" state={{ from: location.pathname }}>
            <Text
              as="span"
              color="primary.300"
              _dark={{ color: 'brand.300' }}
              _hover={{ textDecoration: 'underline' }}
              fontWeight="bold"
            >
              Sign Up
            </Text>
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default LoginPage;
