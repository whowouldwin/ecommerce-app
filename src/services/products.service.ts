import { apiClient } from '../commercetools-environment/apiClient.ts';

export const getProducts = async () => {
  return apiClient.getApiRoot().products().get().execute();
};
