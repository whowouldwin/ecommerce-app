import React from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  useColorModeValue,
} from '@chakra-ui/react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: Option[];
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
}

const defaultCountryOptions: Option[] = [
  { value: 'DE', label: 'Germany' },
  { value: 'PL', label: 'Poland' },
  { value: 'BY', label: 'Belarus' },
];

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options = defaultCountryOptions,
  placeholder,
  error,
  isRequired = false,
}) => {
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Select
        width="200px"
        maxWidth="100%"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        bg={bg}
        borderColor={borderColor}
        _hover={{ borderColor: 'gray.400' }}
        _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomSelect;
