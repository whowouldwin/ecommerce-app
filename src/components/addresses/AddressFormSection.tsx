import { Address } from '@commercetools/platform-sdk';
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Stack,
  Heading,
  Text,
  Checkbox,
  useColorModeValue,
} from '@chakra-ui/react';
import FormInput from '../form/FormInput';
import { AddressDraft } from '../../types/types';
import {
  validateCountry,
  validateCity,
  validateStreet,
  validatePostalCode,
} from '../../utils/validation';
import CustomSelect from '../form/CustomSelect';

interface AddressFormSectionProps {
  addresses: Address[];
  onAdd: (address: Address) => void;
  onSelectDefaultBilling: (index: number | undefined) => void;
  onSelectDefaultShipping: (index: number | undefined) => void;
  defaultBillingIndex?: number;
  defaultShippingIndex?: number;
}

const AddressFormSection: React.FC<AddressFormSectionProps> = ({
  addresses,
  onAdd,
  onSelectDefaultBilling,
  onSelectDefaultShipping,
  defaultBillingIndex,
  defaultShippingIndex,
}) => {
  const [addressDraft, setAddressDraft] = useState<AddressDraft>({
    country: '',
    city: '',
    streetName: '',
    postalCode: '',
  });

  const bg = useColorModeValue('gray.50', 'gray.700');

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'country':
        error = validateCountry(value);
        break;
      case 'city':
        error = validateCity(value);
        break;
      case 'streetName':
        error = validateStreet(value);
        break;
      case 'postalCode':
        error = validatePostalCode(value);
        break;
    }

    setAddressErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAddressDraft((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const [addressErrors, setAddressErrors] = useState<
    Partial<typeof addressDraft>
  >({});

  const handleAdd = () => {
    const newErrors: Partial<typeof addressDraft> = {};

    const countryError = validateCountry(addressDraft.country);
    const cityError = validateCity(addressDraft.city);
    const streetError = validateStreet(addressDraft.streetName);
    const postalError = validatePostalCode(addressDraft.postalCode);

    if (countryError) newErrors.country = countryError;
    if (cityError) newErrors.city = cityError;
    if (streetError) newErrors.streetName = streetError;
    if (postalError) newErrors.postalCode = postalError;

    if (Object.keys(newErrors).length > 0) {
      setAddressErrors(newErrors);
      return;
    }

    onAdd(addressDraft);
    setAddressDraft({ country: '', city: '', streetName: '', postalCode: '' });
    setAddressErrors({});
  };

  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setAddressErrors({});
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <VStack spacing={4} align="start" w="100%" ref={formRef}>
      <Heading size="sm">Addresses</Heading>
      <Text fontSize="sm" color="gray.600">
        Please add at least one address. You’ll be able to select default
        billing and shipping addresses.
      </Text>

      {/* Inputs */}
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w="100%">
        <CustomSelect
          label="Country"
          name="country"
          value={addressDraft.country}
          onChange={handleInputChange}
          placeholder="Select country"
        />
        <FormInput
          label="City"
          name="city"
          value={addressDraft.city}
          required={false}
          onChange={handleInputChange}
          error={addressErrors.city}
        />
      </Stack>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w="100%">
        <FormInput
          label="Street"
          name="streetName"
          value={addressDraft.streetName}
          required={false}
          onChange={handleInputChange}
          error={addressErrors.streetName}
        />
        <FormInput
          label="Postal Code"
          name="postalCode"
          value={addressDraft.postalCode}
          required={false}
          onChange={handleInputChange}
          error={addressErrors.postalCode}
        />
      </Stack>

      <Button onClick={handleAdd} colorScheme="green" variant="outline">
        Add
      </Button>

      {addresses.map((addr, index) => (
        <Box
          key={addr.id ?? index}
          p={2}
          borderWidth={1}
          borderRadius="md"
          w="100%"
          bg={bg}
        >
          <Text>
            {addr.country}, {addr.city}, {addr.streetName}, {addr.postalCode}
          </Text>
          <Stack direction="row" mt={2} spacing={4}>
            <Checkbox
              isChecked={defaultBillingIndex === index}
              onChange={(e) =>
                onSelectDefaultBilling(e.target.checked ? index : undefined)
              }
            >
              Billing
            </Checkbox>

            <Checkbox
              isChecked={defaultShippingIndex === index}
              onChange={(e) =>
                onSelectDefaultShipping(e.target.checked ? index : undefined)
              }
            >
              Shipping
            </Checkbox>
          </Stack>
        </Box>
      ))}
    </VStack>
  );
};

export default AddressFormSection;
