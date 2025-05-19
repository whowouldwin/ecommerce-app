import { apiClient } from '../commercetools-environment/apiClient.ts';
import { AuthFlowType, LocalStorageKey } from '../enums/appEnums.ts';
import { removeDataFromLS } from './local-storage.service.ts';
import { IUserAuthData } from '../types';

export const login = ({ email, password }: IUserAuthData): Promise<void> => {
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

export const logout = (): Promise<void> => {
  apiClient.changeApiRoot(AuthFlowType.CREDENTIALS_FLOW);
  removeDataFromLS(LocalStorageKey.SESSION);
  return Promise.resolve();
};

export const verifyAuthentication = async (): Promise<{ email: string }> => {
  try {
    const userData = await apiClient.getCurrentUser();
    return { email: userData.email };
  } catch (error) {
    console.error('Authentication verification failed:', error);
    throw error;
  }
};
