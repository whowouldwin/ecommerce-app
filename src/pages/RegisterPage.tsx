import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Stack,
  Heading,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import { FormFields } from '../types/types';
import CustomToast from '../components/CustomToast';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../features/user/userSlice';
import { registerCustomer } from '../services';
import {
  validatePassword,
  validatePasswordConfirmation,
  validateEmail,
  validateName,
  validateDateOfBirth,
} from '../utils/validation';
import FormInput from '../components/form/FormInput';
import AddressFormSection from '../components/addresses/AddressFormSection';

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
    dateOfBirth: '',
    addresses: [],
  });

  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [error, setError] = useState('');

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
        message = validateEmail(value);
        break;
      case 'password':
        message = validatePassword(value);
        break;
      case 'confirmPassword':
        message = validatePasswordConfirmation(form.password, value);
        break;
      case 'firstName':
      case 'lastName':
        message = validateName(value, name);
        break;
      case 'dateOfBirth':
        message = validateDateOfBirth(value);
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

    if (form.addresses.length === 0) {
      setError('At least one address is required.');
      return;
    }

    try {
      await registerCustomer({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth,
        addresses: form.addresses,
        defaultBillingAddress: form.defaultBillingAddress,
        defaultShippingAddress: form.defaultShippingAddress,
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
          <FormInput
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </Stack>

        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormInput
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
        </Stack>

        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            showToggle
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            showToggle
          />
        </Stack>

        <AddressFormSection
          addresses={form.addresses}
          onAdd={(addr) =>
            setForm((prev) => ({
              ...prev,
              addresses: [...prev.addresses, addr],
            }))
          }
          defaultBillingIndex={form.defaultBillingAddress}
          defaultShippingIndex={form.defaultShippingAddress}
          onSelectDefaultBilling={(index) =>
            setForm((prev) => ({ ...prev, defaultBillingAddress: index }))
          }
          onSelectDefaultShipping={(index) =>
            setForm((prev) => ({ ...prev, defaultShippingAddress: index }))
          }
        />

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
