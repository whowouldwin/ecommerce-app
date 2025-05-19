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
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import { FormFields } from '../types/types';
import CustomToast from '../components/CustomToast';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../features/user/userSlice';
import { registerCustomer } from '../services';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const [form, setForm] = useState<FormFields>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[A-Za-zА-Яа-яёЁ\s-]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue =
      name === 'password' || name === 'confirmPassword'
        ? value
        : value.trimStart();

    setForm((prev) => ({ ...prev, [name]: trimmedValue }));
    validateField(name, trimmedValue);
  };

  const validateField = (name: string, value: string) => {
    let message = '';

    switch (name) {
      case 'email':
        if (!emailRegex.test(value.trim())) {
          message = 'Please enter a valid email address.';
        }
        break;
      case 'password':
        if (value !== value.trim()) {
          message = 'Password should not contain leading or trailing spaces.';
        } else if (value.length < 8) {
          message = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(value)) {
          message = 'At least one uppercase letter required';
        } else if (!/[a-z]/.test(value)) {
          message = 'At least one lowercase letter required';
        } else if (!/[0-9]/.test(value)) {
          message = 'At least one number required';
        }
        break;
      case 'confirmPassword':
        if (value !== form.password) {
          message = 'Passwords do not match.';
        }
        break;
      case 'firstName':
        if (!value.trim()) {
          message = 'This field is required.';
        } else if (!nameRegex.test(value)) {
          message =
            'First name should not contain numbers or special characters.';
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          message = 'This field is required.';
        } else if (!nameRegex.test(value)) {
          message =
            'Last name should not contain numbers or special characters.';
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    Object.entries(form).forEach(([key, value]) => validateField(key, value));

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    try {
      await registerCustomer({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });

      await dispatch(
        loginUser({ email: form.email.trim(), password: form.password }),
      )
        .unwrap()
        .catch(() => {
          throw new Error('Login failed after registration.');
        });

      toast({
        description: 'You are now registered.',
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

      navigate(location.state?.from || '/');
    } catch (err) {
      setError(
        err instanceof Error
          ? `Error: ${err.message}`
          : 'An error occurred during registration. Please try again.',
      );
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
        Sign Up for FLR
      </Heading>
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired isInvalid={!!errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <Text color="red.500" fontSize="sm">
                {errors.firstName}
              </Text>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <Text color="red.500" fontSize="sm">
                {errors.lastName}
              </Text>
            )}
          </FormControl>
        </Stack>

        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <Text color="red.500" fontSize="sm">
              {errors.email}
            </Text>
          )}
        </FormControl>

        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                pr="4.5rem"
              />
              <InputRightElement width="3rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <Text color="red.500" fontSize="sm">
                {errors.password}
              </Text>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                pr="4.5rem"
              />
              <InputRightElement width="3rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="ghost"
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.confirmPassword && (
              <Text color="red.500" fontSize="sm">
                {errors.confirmPassword}
              </Text>
            )}
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

        <Text fontSize="sm">
          Already have an account?{' '}
          <ChakraLink as={RouterLink} to="/login" color="blue.500">
            Log In
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default RegisterPage;
