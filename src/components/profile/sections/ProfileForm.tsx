import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import {
  Box,
  Heading,
  Button,
  Text,
  Tooltip,
  IconButton,
  Flex,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectUser,
  updateUserProfile,
} from '../../../features/user/userSlice';
import FormInput from '../../form/FormInput';
import CustomToast from '../../CustomToast';
import {
  validateEmail,
  validateName,
  validateDateOfBirth,
} from '../../../utils/validation';

export const ProfileForm: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    dateOfBirth: user.dateOfBirth ?? '',
  });
  const toast = useToast();
  const iconColor = useColorModeValue('gray.700', 'black');

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
  });

  const showCustomToast = (
    message: string,
    status: 'success' | 'error' | 'info',
  ) => {
    toast({
      duration: 3000,
      position: 'top-left',
      render: ({ onClose }) => (
        <CustomToast message={message} status={status} onClose={onClose} />
      ),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    let errorMsg = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
        errorMsg = validateName(value, name);
        break;
      case 'email':
        errorMsg = validateEmail(value);
        break;
      case 'dateOfBirth':
        errorMsg = validateDateOfBirth(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSave = async () => {
    const updatedErrors = {
      firstName: validateName(formData.firstName, 'firstName'),
      lastName: validateName(formData.lastName, 'lastName'),
      email: validateEmail(formData.email),
      dateOfBirth: validateDateOfBirth(formData.dateOfBirth),
    };

    setErrors(updatedErrors);

    const hasErrors = Object.values(updatedErrors).some(Boolean);
    if (hasErrors) return;

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      showCustomToast('Data saved successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      showCustomToast('Error saving data!', 'error');
    }
  };

  const isFormValid =
    Object.values(errors).every((e) => !e) &&
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim();

  return (
    <Box p={6} borderRadius="md">
      <Flex alignItems="center" justifyContent="flex-start" gap="20px" mb={4}>
        <Heading fontSize="xl">User Profile</Heading>
        {!isEditing && (
          <Tooltip label="Edit" hasArrow>
            <IconButton
              aria-label="Edit profile"
              icon={<FiEdit color={iconColor} />}
              size="sm"
              onClick={() => setIsEditing(true)}
              variant="ghost"
              bg="gray.200"
              _hover={{ bg: 'gray.300' }}
            />
          </Tooltip>
        )}
      </Flex>
      {!isEditing ? (
        <>
          <Text mb={2}>
            <b>First Name:</b> {user.firstName}
          </Text>
          <Text mb={2}>
            <b>Last Name:</b> {user.lastName}
          </Text>
          <Text mb={2}>
            <b>Date of Birth:</b> {user.dateOfBirth}
          </Text>
          <Text mb={2}>
            <b>Email:</b> {user.email}
          </Text>
        </>
      ) : (
        <>
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required={false}
            mb={3}
          />

          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required={false}
            mb={3}
          />

          <FormInput
            label="Date of birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
            required={false}
            mb={3}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required={false}
            mb={6}
          />

          <Button
            colorScheme="teal"
            onClick={handleSave}
            isDisabled={!isFormValid}
          >
            Save Changes
          </Button>
          <Button ml={3} variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </>
      )}
    </Box>
  );
};
