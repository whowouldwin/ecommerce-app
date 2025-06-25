import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
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
import FormInput from '../components/form/FormInput';
import { validateEmail, validatePassword } from '../utils/validation';
import { initCart } from '../features/cart/cartSlice.ts';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isFormValid =
    email.trim() !== '' &&
    password.trim() !== '' &&
    !emailError &&
    !passwordError;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError || passwordError || !email || !password) {
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        dispatch(initCart());
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
        setPasswordError('Login failed: Invalid credentials');
      }
    } catch (err) {
      if (err instanceof Error) {
        setPasswordError(`Error: ${err.message}`);
      } else {
        setPasswordError('Unknown error occurred. Try again!');
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

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
        />

        <FormInput
          label="Password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
          showToggle
        />

        <Button
          colorScheme="blue"
          type="submit"
          width="full"
          isDisabled={!isFormValid}
        >
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
