import { apiClient } from '../commercetools-environment/apiClient.ts';

export const getME = async () => {
  return await apiClient.getApiRoot().me().get().execute();
};
