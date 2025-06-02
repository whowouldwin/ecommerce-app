import React from 'react';
import { useToast } from '@chakra-ui/react';
import AddressForm, { AddressInput } from './AddressForm';
import { useAppDispatch } from '../../../../store/hooks';
import { addAddress } from '../../../../features/user/userSlice';
import CustomToast from '../../../../components/CustomToast';

interface AddAddressFormProps {
  onClose: () => void;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const handleSave = async (data: AddressInput) => {
    try {
      await dispatch(addAddress(data)).unwrap();

      toast({
        duration: 3000,
        isClosable: true,
        position: 'top-left',
        render: ({ onClose }) => (
          <CustomToast
            message="Address added successfully!"
            onClose={onClose}
            status="success"
          />
        ),
      });

      onClose();
    } catch (error) {
      console.log(error);
      toast({
        duration: 5000,
        isClosable: true,
        position: 'top-left',
        render: ({ onClose }) => (
          <CustomToast
            message="Error adding address. Try again later."
            onClose={onClose}
            status="error"
          />
        ),
      });
    }
  };

  return <AddressForm onSave={handleSave} onCancel={onClose} />;
};

export default AddAddressForm;
