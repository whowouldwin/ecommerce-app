import React, { useEffect, useState } from 'react';
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
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { useAppSelector } from '../store/hooks';
import { selectUser, loginUser } from '../features/user/userSlice';
import CustomToast from '../components/CustomToast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const user = useAppSelector(selectUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate('/');
    }
  }, [navigate, user]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const trimmed = value.trim();

    if (!trimmed) {
      setEmailError('Email is required');
    } else if (trimmed !== value) {
      setEmailError('No leading or trailing spaces allowed');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setEmailError('Enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const trimmed = value.trim();

    if (!trimmed) {
      setPasswordError('Password is required');
    } else if (trimmed !== value) {
      setPasswordError('No leading or trailing spaces allowed');
    } else if (trimmed.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (!/[A-Z]/.test(trimmed)) {
      setPasswordError('At least one uppercase letter required');
    } else if (!/[a-z]/.test(trimmed)) {
      setPasswordError('At least one lowercase letter required');
    } else if (!/[0-9]/.test(trimmed)) {
      setPasswordError('At least one number required');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError || passwordError || !email || !password) {
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

        <FormControl isRequired isInvalid={!!emailError}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
          {emailError && (
            <Text color="red.500" fontSize="sm" mt={1} fontWeight="medium">
              {emailError}
            </Text>
          )}
        </FormControl>

        <FormControl isRequired isInvalid={!!passwordError}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
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
          {passwordError && (
            <Text color="red.500" fontSize="sm" mt={1} fontWeight="medium">
              {passwordError}
            </Text>
          )}
        </FormControl>

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
