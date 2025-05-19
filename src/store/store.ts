import { configureStore, Middleware, Action } from '@reduxjs/toolkit';
import { userReducer } from '../features/user/userSlice';

const isAction = (action: unknown): action is Action => {
  return typeof action === 'object' && action !== null && 'type' in action;
};

const localStorageMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const result = next(action);

    if (
      isAction(action) &&
      (action.type === 'user/login/fulfilled' ||
        action.type === 'user/logout/fulfilled' ||
        action.type === 'user/verify/fulfilled' ||
        action.type === 'user/verify/rejected')
    ) {
      const userState = store.getState().user;
      localStorage.setItem('userState', JSON.stringify(userState));
    }

    return result;
  };

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
