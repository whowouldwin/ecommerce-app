import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Stack,
  Heading,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FormFields } from '../types/types';
import CustomToast from '../components/CustomToast';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<FormFields>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return 'Invalid email!';
    if (form.password.length < 8)
      return 'Password must be at least 8 characters long!';
    if (!form.firstName || !form.lastName)
      return 'Enter your first and last name!';
    if (form.password !== form.confirmPassword)
      return 'Passwords do not match!';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const registerRes = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      });

      if (!registerRes.ok) throw new Error('Registration error!');

      const loginRes = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!loginRes.ok) throw new Error('Login error!');

      const data = await loginRes.json();
      localStorage.setItem('token', data.token);

      toast({
        description: 'You are now logged in.',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
        render: ({ onClose }) => (
          <CustomToast
            message="Registration successful!"
            onClose={onClose}
            status="success"
          />
        ),
      });

      navigate('/');
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
      maxW="lg"
      mx="auto"
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg={useColorModeValue('white', 'gray.700')}
      color={useColorModeValue('gray.800', 'white')}
    >
      <Heading
        color="primary.300"
        _dark={{ color: 'brand.300' }}
        mb={6}
        textAlign="center"
      >
        Sign Up to FLR
      </Heading>
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </FormControl>
        </Stack>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </FormControl>

        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </FormControl>
        </Stack>

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}

        <Button colorScheme="blue" type="submit" width="full">
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
};

export default RegisterPage;
