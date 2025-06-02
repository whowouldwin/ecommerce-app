export interface Address {
  apartment?: string;
  city?: string;
  country?: string;
  id?: string;
  postalCode?: string;
  streetName?: string;
  streetNumber?: string;
}

export interface AddressInForm {
  id: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
}
