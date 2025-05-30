import { configureStore, Middleware } from '@reduxjs/toolkit';
import { userReducer } from '../features/user/userSlice';
import { categoryReducer } from '../features/category/categorySlice';
import { productReducer } from '../features/product/productSlice.ts';
import { filterReducer } from '../features/filter/filterSlice.ts';

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  localStorage.setItem('userState', JSON.stringify(store.getState().user));
  return result;
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    product: productReducer,
    filters: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
