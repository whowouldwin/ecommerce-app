export type FormFields = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

export type FieldConfig = {
  name: keyof FormFields;
  label: string;
  type: string;
};
