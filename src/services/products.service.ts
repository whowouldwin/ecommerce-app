import { apiClient } from '../commercetools-environment/apiClient.ts';
import {
  ProductFilterParams,
  buildFilterQueryArgs,
} from './filters.service.ts';

export const getProducts = async (
  filterParams?: ProductFilterParams,
  sort?: string,
  limit: number = 50,
  offset: number = 0,
) => {
  const queryArgs = buildFilterQueryArgs(filterParams);
  if (sort) {
    queryArgs.sort = sort;
  }

  queryArgs.limit = limit;
  queryArgs.offset = offset;

  return apiClient
    .getApiRoot()
    .productProjections()
    .search()
    .get({ queryArgs })
    .execute();
};

export const getProduct = (id: string) => {
  return apiClient.getApiRoot().products().withId({ ID: id }).get().execute();
};
