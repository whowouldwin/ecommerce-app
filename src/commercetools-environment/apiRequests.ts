import { apiClient } from './apiClient.ts';
import { removeDataFromLS } from '../services';
import { AuthFlowType } from '../enums';

export const getProducts = async () => {
  return apiClient.getApiRoot().products().get().execute();
};
export const loginUser = ({
  loginUser,
  passwordUser,
}: {
  loginUser: string;
  passwordUser: string;
}) => {
  return apiClient
    .getApiRoot()
    .me()
    .login()
    .post({
      body: {
        email: loginUser,
        password: passwordUser,
      },
    })
    .execute()
    .then(() => {
      apiClient.changeApiRoot(AuthFlowType.PASSWORD_FLOW, {
        username: loginUser,
        password: passwordUser,
      });
    });
};

export const logoutUser = () => {
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
        removeDataFromLS('session');
      }
    });
};

export const getME = () => {
  return apiClient.getApiRoot().me().get().execute();
};
