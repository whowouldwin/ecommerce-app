import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Tooltip,
  IconButton,
  Stack,
  useColorModeValue,
  useRadioGroup,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';
import { useAppDispatch } from '../../../../store/hooks';
import { useAppSelector } from '../../../../store/hooks';
import {
  selectUser,
  deleteAddress,
  updateDefaultAddress,
} from '../../../../features/user/userSlice';
import AddressCard from './AddressCard';
import AddAddressForm from './AddAddressForm';
import EditAddressForm from './EditAddressForm';
import { CustomRadioCard } from '../../../CustomRadioCard';
import CustomToast from '../../../../components/CustomToast';

export const AddressSection: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const toast = useToast();

  const addresses = user.addresses || [];
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [defaultBillingId, setDefaultBillingId] = useState<string>(
    user.defaultBillingAddressId ?? '',
  );
  const [defaultShippingId, setDefaultShippingId] = useState<string>(
    user.defaultShippingAddressId ?? '',
  );
  const iconColor = useColorModeValue('gray.700', 'black');

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();
      toast({
        duration: 3000,
        isClosable: true,
        position: 'top-left',
        render: ({ onClose }) => (
          <CustomToast
            message="Delete in successfully!"
            onClose={onClose}
            status="success"
          />
        ),
      });
    } catch (error) {
      console.log(error);
      toast({
        duration: 5000,
        isClosable: true,
        position: 'top-left',
        render: ({ onClose }) => (
          <CustomToast
            message="Error deleting address. Try again later!"
            onClose={onClose}
            status="error"
          />
        ),
      });
    }
  };

  const handleEdit = (id: string) => {
    setEditingAddressId(id);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAddressId(null);
  };

  const handleBillingChange = (id: string) => {
    setDefaultBillingId(id);
    dispatch(updateDefaultAddress({ addressId: id, type: 'billing' }));
    console.log('Set default billing address:', id);
  };

  const handleShippingChange = (id: string) => {
    setDefaultShippingId(id);
    dispatch(updateDefaultAddress({ addressId: id, type: 'shipping' }));
    console.log('Set default shipping address:', id);
  };

  const {
    getRootProps: getBillingRootProps,
    getRadioProps: getBillingRadioProps,
  } = useRadioGroup({
    name: 'billing',
    defaultValue: defaultBillingId,
    onChange: handleBillingChange,
  });

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'shipping',
    defaultValue: defaultShippingId,
    onChange: handleShippingChange,
  });

  const group = getRootProps();

  return (
    <Box p={6} borderRadius="md">
      <Flex alignItems="center" mb={4}>
        <Heading fontSize="xl" mr={4}>
          Addresses
        </Heading>
        {!showForm && !editingAddressId && (
          <Tooltip label="Add" hasArrow>
            <IconButton
              aria-label="Add Address"
              icon={<AddIcon color={iconColor} />}
              size="sm"
              onClick={() => setShowForm(true)}
              variant="ghost"
              bg="gray.200"
              _hover={{ bg: 'gray.300' }}
            />
          </Tooltip>
        )}
      </Flex>

      {editingAddressId ? (
        <EditAddressForm
          addressId={editingAddressId}
          onClose={handleFormClose}
        />
      ) : showForm ? (
        <AddAddressForm onClose={handleFormClose} />
      ) : addresses.length === 0 ? (
        <Text>No addresses found.</Text>
      ) : (
        <>
          <Heading size="md" mb={2}>
            Default Billing Address
          </Heading>
          <Stack {...getBillingRootProps()} spacing={3} mb={6}>
            {addresses.map((address) => {
              const radio = getBillingRadioProps({ value: address.id ?? '' });
              return (
                <CustomRadioCard key={`billing-${address.id}`} {...radio}>
                  <AddressCard
                    id={address.id ?? ''}
                    streetName={address.streetName ?? ''}
                    streetNumber={address.streetNumber ?? ''}
                    postalCode={address.postalCode ?? ''}
                    city={address.city ?? ''}
                    apartment={address.apartment}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDefault={address.id === defaultBillingId}
                    label="Billing"
                  />
                </CustomRadioCard>
              );
            })}
          </Stack>

          <Heading size="md" mb={2}>
            Default Shipping Address
          </Heading>
          <Stack {...group} spacing={3}>
            {addresses.map((address) => {
              const radio = getRadioProps({ value: address.id ?? '' });
              return (
                <CustomRadioCard key={address.id} {...radio}>
                  <AddressCard
                    id={address.id ?? ''}
                    streetName={address.streetName ?? ''}
                    streetNumber={address.streetNumber ?? ''}
                    postalCode={address.postalCode ?? ''}
                    city={address.city ?? ''}
                    apartment={address.apartment}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDefault={address.id === defaultShippingId}
                    label="Shipping"
                  />
                </CustomRadioCard>
              );
            })}
          </Stack>
        </>
      )}
    </Box>
  );
};
