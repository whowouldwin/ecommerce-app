export type AddressFields = {
  streetName: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  country: string;
};

export type FormFields = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  defaultAddress: AddressFields;
  billingAddress: AddressFields;
  shippingAddress: AddressFields;
  useSameAddressForShipping: boolean;
};

export type FieldConfig = {
  name: keyof FormFields;
  label: string;
  type: string;
};
