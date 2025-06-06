import { Customer } from '@commercetools/platform-sdk';
import { UserState } from './userSlice';
import { RequestStatus } from '../../enums/appEnums';

export const mapCustomerToUserState = (customer: Customer): UserState => ({
  isAuthenticated: true,
  email: customer.email,
  firstName: customer.firstName ?? null,
  lastName: customer.lastName ?? null,
  dateOfBirth: customer.dateOfBirth ?? null,
  addresses: customer.addresses ?? [],
  defaultBillingAddressId: customer.defaultBillingAddressId ?? null,
  defaultShippingAddressId: customer.defaultShippingAddressId ?? null,
  version: customer.version ?? null,
  status: RequestStatus.IDLE,
});
