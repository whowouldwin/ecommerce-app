import React, { useState } from 'react';
import { Box, Heading, Button, VStack } from '@chakra-ui/react';
import CustomToast from '../../CustomToast';
import FormInput from '../../form/FormInput';
import {
  validatePassword,
  validatePasswordConfirmation,
} from '../../../utils/validation';
import { useAppDispatch } from '../../../store/hooks';
import { changePassword } from '../../../features/user/userSlice';

export const UserSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const isFormValid =
    currentPassword.trim() !== '' &&
    newPassword.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    !newPasswordError &&
    !confirmPasswordError;

  const [toast, setToast] = useState<{
    message: string;
    status: 'success' | 'error' | 'info';
    visible: boolean;
  }>({ message: '', status: 'info', visible: false });

  const dispatch = useAppDispatch();

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setNewPasswordError(validatePassword(value));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(validatePasswordConfirmation(newPassword, value));
  };

  const showToast = (message: string, status: 'success' | 'error' | 'info') => {
    setToast({ message, status, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const handleSubmit = async () => {
    const newPassError = validatePassword(newPassword);
    const confirmError = validatePasswordConfirmation(
      newPassword,
      confirmPassword,
    );

    setNewPasswordError(newPassError);
    setConfirmPasswordError(confirmError);

    if (newPassError || confirmError) return;
    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.log(error);
      showToast('Failed to change password!', 'error');
    }
  };

  return (
    <Box maxW="md" p={4} position="relative">
      <Heading mb={4} fontSize="xl">
        Change password
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormInput
          label="Current Password"
          name="currentPassword"
          type="password"
          value={currentPassword}
          required={false}
          onChange={(e) => setCurrentPassword(e.target.value)}
          showToggle
        />

        <FormInput
          label="New Password"
          name="newPassword"
          value={newPassword}
          required={false}
          onChange={handleNewPasswordChange}
          error={newPasswordError}
          showToggle
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          required={false}
          onChange={handleConfirmPasswordChange}
          error={confirmPasswordError}
          showToggle
        />

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={!isFormValid}
        >
          Save
        </Button>
      </VStack>

      {toast.visible && (
        <Box position="fixed" top="0" left="0" mt={4} mr={4} zIndex={10}>
          <CustomToast
            message={toast.message}
            status={toast.status}
            onClose={handleCloseToast}
          />
        </Box>
      )}
    </Box>
  );
};
