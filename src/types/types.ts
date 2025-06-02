import { Address } from '@commercetools/platform-sdk';
export interface FormFields {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  defaultBillingAddress?: number;
  defaultShippingAddress?: number;
}

export type FieldConfig = {
  name: keyof FormFields;
  label: string;
  type: string;
};

export type Section =
  | 'profile'
  | 'section2'
  | 'section3'
  | 'section4'
  | 'section5';

export type AddressInput = {
  id?: string;
  country: string;
  city: string;
  street?: string;
  postalCode: string;
};

export type AddressDraft = {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
};
