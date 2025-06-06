import React from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import AddressForm, { AddressInput } from './AddressForm';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../features/user/userSlice';
import { mapCustomerToUserState } from '../../../../features/user/userMappers';
import { apiClient } from '../../../../commercetools-environment/apiClient';
import CustomToast from '../../../../components/CustomToast';

import { updateUser } from '../../../../features/user/userSlice';

interface EditAddressFormProps {
  addressId: string;
  onClose: () => void;
}

const EditAddressForm: React.FC<EditAddressFormProps> = ({
  addressId,
  onClose,
}) => {
  const user = useAppSelector(selectUser);
  const toast = useToast();
  const address = user.addresses?.find((a) => a.id === addressId);

  const dispatch = useDispatch();

  const handleSave = async (updatedData: AddressInput) => {
    try {
      if (user.version === null) throw new Error('User not found!');
      const response = await apiClient
        .getApiRoot()
        .me()
        .post({
          body: {
            version: user.version,
            actions: [
              {
                action: 'changeAddress',
                addressId: addressId,
                address: {
                  apartment: updatedData.apartment,
                  city: updatedData.city,
                  country: updatedData.country,
                  postalCode: updatedData.postalCode,
                  streetName: updatedData.streetName,
                  streetNumber: updatedData.streetNumber,
                },
              },
            ],
          },
        })
        .execute();

      dispatch(updateUser(mapCustomerToUserState(response.body)));

      toast({
        duration: 3000,
        isClosable: true,
        position: 'top-left',
        render: ({ onClose }) => (
          <CustomToast
            message="Update in successfully!"
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
            message="Error updating address. Try again later!"
            onClose={onClose}
            status="error"
          />
        ),
      });
    }
  };

  if (!address) return null;

  return (
    <AddressForm initialData={address} onSave={handleSave} onCancel={onClose} />
  );
};

export default EditAddressForm;
