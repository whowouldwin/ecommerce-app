import {
  ClientResponse,
  Customer,
  MyCustomerDraft,
} from '@commercetools/platform-sdk';
import { apiClient } from '../commercetools-environment/apiClient.ts';
import { AuthFlowType, LocalStorageKey } from '../enums/appEnums.ts';
import { removeDataFromLS } from './local-storage.service.ts';
import { IUserAuthData } from '../types';
import { getME } from './customer.service.ts';
import { tokenCacheStore } from '../commercetools-environment/tokenCacheStore.ts';

export const login = async ({ email, password }: IUserAuthData) => {
  let response;
  try {
    await apiClient
      .getApiRoot()
      .me()
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();

    apiClient.changeApiRoot(AuthFlowType.PASSWORD_FLOW, {
      username: email,
      password: password,
    });

    response = await apiClient.getApiRoot().me().get().execute();
  } catch (error) {
    console.log('login-error', error);
    throw error;
  }
  return response;
};

export const logout = async () => {
  apiClient.changeApiRoot(AuthFlowType.CREDENTIALS_FLOW);
  removeDataFromLS(LocalStorageKey.SESSION);
  tokenCacheStore.clear();
  await getME().catch((error) => {
    console.log('logout is ok', error);
  });
  return Promise.resolve();
};

export const registerCustomer = async (data: MyCustomerDraft) => {
  // console.log('registerCustomer', data);
  return await apiClient
    .getApiRoot()
    .me()
    .signup()
    .post({
      body: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        addresses: data.addresses,
        defaultBillingAddress: data.defaultBillingAddress,
        defaultShippingAddress: data.defaultShippingAddress,
      },
    })
    .execute();
};

export const retryAuthWithRefresh = async (): Promise<
  ClientResponse<Customer>
> => {
  return await getME().catch((error) => {
    if (error.statusCode !== 403) {
      console.log(
        'unsuccessful attempt to restore the previous user session',
        error,
      );
      removeDataFromLS(LocalStorageKey.SESSION);
      apiClient.changeApiRoot(AuthFlowType.CREDENTIALS_FLOW);
      return error;
    }
  });
};
