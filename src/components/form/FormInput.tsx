import {
  FormControl,
  FormLabel,
  Input,
  Text,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  showToggle?: boolean;
  mb?: number | string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = true,
  showToggle = false,
  mb,
}) => {
  const [show, setShow] = useState(false);
  const inputType = showToggle ? (show ? 'text' : 'password') : type;

  return (
    <FormControl isInvalid={!!error} isRequired={required} mb={mb}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <InputGroup>
        <Input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          required={false}
          pr={showToggle ? '4.5rem' : undefined}
        />
        {showToggle && (
          <InputRightElement width="3rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShow((prev) => !prev)}
              variant="ghost"
              aria-label={show ? 'Hide' : 'Show'}
            >
              {show ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      {error && (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      )}
    </FormControl>
  );
};

export default FormInput;
