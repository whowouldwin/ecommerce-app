import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';
import FormInput from '../../../form/FormInput.tsx';
import { Address } from '../../../../types/interfaces.ts';
import {
  validateCountry,
  validateCity,
  validateStreet,
  validatePostalCode,
} from '../../../../utils/validation.ts';

interface AddressFormProps {
  initialData?: Partial<Address>;
  onSave: (data: AddressInput) => void;
  onCancel: () => void;
}

type AddressProfileError = Partial<Record<keyof AddressInput, string>>;

export interface AddressInput {
  streetName: string;
  streetNumber: string;
  postalCode: string;
  country: string;
  city: string;
  apartment?: string;
  version: number | null;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialData = {},
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<AddressInput>({
    streetName: '',
    streetNumber: '',
    postalCode: '',
    country: '',
    city: '',
    apartment: '',
    version: null,
    ...initialData, // если редактируем — заполним
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof AddressInput, value);
  };

  const [addressErrors, setAddressErrors] = useState<AddressProfileError>({});

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

  const handleSubmit = () => {
    const newErrors: AddressProfileError = {};

    const countryError = validateCountry(formData.country);
    const cityError = validateCity(formData.city);
    const streetError = validateStreet(formData.streetName);
    const postalError = validatePostalCode(formData.postalCode);

    if (countryError) newErrors.country = countryError;
    if (cityError) newErrors.city = cityError;
    if (streetError) newErrors.streetName = streetError;
    if (postalError) newErrors.postalCode = postalError;

    if (Object.keys(newErrors).length > 0) {
      setAddressErrors(newErrors);
      return;
    }
    onSave(formData);
    setAddressErrors({});
  };
  interface Option {
    code: string;
    name: string;
  }
  const countryOptions: Option[] = [
    { code: 'DE', name: 'Germany' },
    { code: 'PL', name: 'Poland' },
    { code: 'BY', name: 'Belarus' },
  ];

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
      <FormControl isInvalid={!!addressErrors.country}>
        <FormLabel>Country</FormLabel>
        <Select
          width="200px"
          maxWidth="100%"
          name="country"
          placeholder="Select country"
          value={formData.country}
          onChange={handleChange}
          mb={3}
        >
          {countryOptions.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{addressErrors.country}</FormErrorMessage>
      </FormControl>
      <FormInput
        label="Street Name"
        name="streetName"
        value={formData.streetName}
        onChange={handleChange}
        required={false}
        mb={3}
        error={addressErrors.streetName}
      />
      <FormInput
        label="Street Number"
        name="streetNumber"
        value={formData.streetNumber}
        onChange={handleChange}
        required={false}
        mb={3}
      />
      <FormInput
        label="Postal Code"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
        required={false}
        mb={3}
        error={addressErrors.postalCode}
      />
      <FormInput
        label="City"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required={false}
        mb={3}
        error={addressErrors.city}
      />

      <Flex mt={4} justify="flex-end" gap={3}>
        <Button onClick={onCancel} variant="ghost">
          Cancel
        </Button>
        <Button colorScheme="teal" onClick={handleSubmit}>
          Save
        </Button>
      </Flex>
    </Box>
  );
};

export default AddressForm;
