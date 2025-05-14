import { apiClient } from '../commercetools-environment/apiClient.ts';

export const getME = () => {
  return apiClient.getApiRoot().me().get().execute();
};
