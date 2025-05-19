import React, { useState, useEffect } from 'react';
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
  Checkbox,
  Divider,
  Select,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import { FormFields, AddressFields } from '../types/types';
import CustomToast from '../components/CustomToast';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../features/user/userSlice';
import { registerCustomer } from '../services';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const emptyAddress: AddressFields = {
    streetName: '',
    streetNumber: '',
    city: '',
    postalCode: '',
    country: 'US',
  };

  const [form, setForm] = useState<FormFields>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    defaultAddress: { ...emptyAddress },
    billingAddress: { ...emptyAddress },
    shippingAddress: { ...emptyAddress },
    useSameAddressForShipping: true,
  });

  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    addressType?: 'defaultAddress' | 'billingAddress' | 'shippingAddress',
  ) => {
    if (addressType) {
      setForm({
        ...form,
        [addressType]: {
          ...form[addressType],
          [e.target.name]: e.target.value,
        },
      });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target;
    setForm({ ...form, [name]: checked });
  };

  useEffect(() => {
    if (form.useSameAddressForShipping) {
      const billing = form.billingAddress;
      const shipping = form.shippingAddress;

      const isDifferent =
        billing.streetName !== shipping.streetName ||
        billing.streetNumber !== shipping.streetNumber ||
        billing.city !== shipping.city ||
        billing.postalCode !== shipping.postalCode ||
        billing.country !== shipping.country;

      if (isDifferent) {
        setForm((prevForm) => ({
          ...prevForm,
          shippingAddress: { ...prevForm.billingAddress },
        }));
      }
    }
  }, [
    form.useSameAddressForShipping,
    form.billingAddress,
    form.shippingAddress,
  ]);

  const validateAddress = (
    address: AddressFields,
    addressType: string,
  ): string => {
    if (
      !address.streetName ||
      !address.city ||
      !address.postalCode ||
      !address.country
    ) {
      return `Please fill in all required fields for ${addressType} address!`;
    }
    return '';
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (true) {
      case !emailRegex.test(form.email):
        return 'Invalid email!';
      case form.password.length < 8:
        return 'Password must be at least 8 characters long!';
      case !form.firstName || !form.lastName:
        return 'Enter your first and last name!';
      case form.password !== form.confirmPassword:
        return 'Passwords do not match!';
      case validateAddress(form.defaultAddress, 'default') !== '':
        return validateAddress(form.defaultAddress, 'default');
      case validateAddress(form.billingAddress, 'billing') !== '':
        return validateAddress(form.billingAddress, 'billing');
      case !form.useSameAddressForShipping &&
        validateAddress(form.shippingAddress, 'shipping') !== '':
        return validateAddress(form.shippingAddress, 'shipping');
      default:
        return '';
    }
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
      const defaultAddress = {
        streetName: form.defaultAddress.streetName,
        streetNumber: form.defaultAddress.streetNumber,
        city: form.defaultAddress.city,
        postalCode: form.defaultAddress.postalCode,
        country: form.defaultAddress.country,
      };

      const billingAddress = {
        streetName: form.billingAddress.streetName,
        streetNumber: form.billingAddress.streetNumber,
        city: form.billingAddress.city,
        postalCode: form.billingAddress.postalCode,
        country: form.billingAddress.country,
      };

      const shippingAddress = form.useSameAddressForShipping
        ? billingAddress
        : {
            streetName: form.shippingAddress.streetName,
            streetNumber: form.shippingAddress.streetNumber,
            city: form.shippingAddress.city,
            postalCode: form.shippingAddress.postalCode,
            country: form.shippingAddress.country,
          };

      await registerCustomer({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        addresses: [defaultAddress, billingAddress, shippingAddress],
        defaultShippingAddress: 2,
        defaultBillingAddress: 1,
      });

      await dispatch(loginUser({ email: form.email, password: form.password }))
        .unwrap()
        .catch(() => {
          throw new Error('Login error!');
        });

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

      navigate(location.state?.from || '/');
    } catch (err) {
      setError(
        err instanceof Error
          ? `Error: ${err.message}`
          : 'Unknown error occurred. Try again!',
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

        <Divider my={4} />
        <Heading size="md" w="100%" textAlign="left">
          Default Address
        </Heading>
        <Text fontSize="sm" w="100%" textAlign="left" mb={2}>
          This address will be set as your default address
        </Text>

        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired>
            <FormLabel>Street Name</FormLabel>
            <Input
              name="streetName"
              value={form.defaultAddress.streetName}
              onChange={(e) => handleChange(e, 'defaultAddress')}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Street Number</FormLabel>
            <Input
              name="streetNumber"
              value={form.defaultAddress.streetNumber}
              onChange={(e) => handleChange(e, 'defaultAddress')}
            />
          </FormControl>
        </Stack>

        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired>
            <FormLabel>City</FormLabel>
            <Input
              name="city"
              value={form.defaultAddress.city}
              onChange={(e) => handleChange(e, 'defaultAddress')}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Postal Code</FormLabel>
            <Input
              name="postalCode"
              value={form.defaultAddress.postalCode}
              onChange={(e) => handleChange(e, 'defaultAddress')}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Country</FormLabel>
            <Select
              name="country"
              value={form.defaultAddress.country}
              onChange={(e) => handleChange(e, 'defaultAddress')}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="PL">Poland</option>
              <option value="BY">Belarus</option>
            </Select>
          </FormControl>
        </Stack>

        <Divider my={4} />
        <Heading size="md" w="100%" textAlign="left">
          Billing Address
        </Heading>

        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired>
            <FormLabel>Street Name</FormLabel>
            <Input
              name="streetName"
              value={form.billingAddress.streetName}
              onChange={(e) => handleChange(e, 'billingAddress')}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Street Number</FormLabel>
            <Input
              name="streetNumber"
              value={form.billingAddress.streetNumber}
              onChange={(e) => handleChange(e, 'billingAddress')}
            />
          </FormControl>
        </Stack>

        <Stack spacing={4} w="100%" direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired>
            <FormLabel>City</FormLabel>
            <Input
              name="city"
              value={form.billingAddress.city}
              onChange={(e) => handleChange(e, 'billingAddress')}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Postal Code</FormLabel>
            <Input
              name="postalCode"
              value={form.billingAddress.postalCode}
              onChange={(e) => handleChange(e, 'billingAddress')}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Country</FormLabel>
            <Select
              name="country"
              value={form.billingAddress.country}
              onChange={(e) => handleChange(e, 'billingAddress')}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="PL">Poland</option>
              <option value="BY">Belarus</option>
            </Select>
          </FormControl>
        </Stack>

        <FormControl>
          <Checkbox
            name="useSameAddressForShipping"
            isChecked={form.useSameAddressForShipping}
            onChange={handleCheckboxChange}
          >
            Use same address for shipping
          </Checkbox>
        </FormControl>

        {!form.useSameAddressForShipping && (
          <>
            <Divider my={4} />
            <Heading size="md" w="100%" textAlign="left">
              Shipping Address
            </Heading>

            <Stack
              spacing={4}
              w="100%"
              direction={{ base: 'column', md: 'row' }}
            >
              <FormControl isRequired>
                <FormLabel>Street Name</FormLabel>
                <Input
                  name="streetName"
                  value={form.shippingAddress.streetName}
                  onChange={(e) => handleChange(e, 'shippingAddress')}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Street Number</FormLabel>
                <Input
                  name="streetNumber"
                  value={form.shippingAddress.streetNumber}
                  onChange={(e) => handleChange(e, 'shippingAddress')}
                />
              </FormControl>
            </Stack>

            <Stack
              spacing={4}
              w="100%"
              direction={{ base: 'column', md: 'row' }}
            >
              <FormControl isRequired>
                <FormLabel>City</FormLabel>
                <Input
                  name="city"
                  value={form.shippingAddress.city}
                  onChange={(e) => handleChange(e, 'shippingAddress')}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Postal Code</FormLabel>
                <Input
                  name="postalCode"
                  value={form.shippingAddress.postalCode}
                  onChange={(e) => handleChange(e, 'shippingAddress')}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Country</FormLabel>
                <Select
                  name="country"
                  value={form.shippingAddress.country}
                  onChange={(e) => handleChange(e, 'shippingAddress')}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="PL">Poland</option>
                  <option value="BY">Belarus</option>
                </Select>
              </FormControl>
            </Stack>
          </>
        )}

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}

        <Button colorScheme="blue" type="submit" width="full" mt={4}>
          Sign Up
        </Button>
        <Text fontSize="sm">
          Already have an account?{' '}
          <ChakraLink as={RouterLink} to="/login" color="blue.500">
            Login
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default RegisterPage;
