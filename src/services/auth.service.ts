import { apiClient } from '../commercetools-environment/apiClient.ts';
import { AuthFlowType, LocalStorageKey } from '../enums';
import { removeDataFromLS } from './local-storage.service.ts';
import { IUserAuthData } from '../types';

export const login = ({ email, password }: IUserAuthData) => {
  return apiClient
    .getApiRoot()
    .me()
    .login()
    .post({
      body: {
        email,
        password,
      },
    })
    .execute()
    .then(() => {
      apiClient.changeApiRoot(AuthFlowType.PASSWORD_FLOW, {
        username: email,
        password: password,
      });
    });
};

export const logout = () => {
  apiClient.changeApiRoot(AuthFlowType.CREDENTIALS_FLOW);

  return apiClient
    .getApiRoot()
    .me()
    .get()
    .execute()
    .then((response) => {
      console.log('logoutUser-response', response);
    })
    .catch((error) => {
      if (error.status === 403) {
        removeDataFromLS(LocalStorageKey.SESSION);
        // TODO: redirect to main page
      }
    });
};
