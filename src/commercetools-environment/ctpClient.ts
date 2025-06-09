import {
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  ClientBuilder,
  // LoggerMiddlewareOptions,
  // MiddlewareResponse,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  UserAuthOptions,
} from '@commercetools/ts-client';
import { getAnonymousId } from '../utils/helpers.ts';
import { tokenCacheStore } from './tokenCacheStore.ts';

export const projectKey: string = import.meta.env.VITE_PROJECT_KEY;
export const clientId: string = import.meta.env.VITE_CLIENT_ID;
export const clientSecret: string = import.meta.env.VITE_CLIENT_SECRET;
export const authHost: string = import.meta.env.VITE_AUTH_HOST;
export const apiHost: string = import.meta.env.VITE_API_HOST;
export const scopes: string[] = [import.meta.env.VITE_SCOPE];

// const loggerMiddlewareOptions: LoggerMiddlewareOptions = {
//   loggerFn: (response: MiddlewareResponse) => {
//     console.log('Response is: ', response);
//   },
// };

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiHost,
  httpClient: fetch,
};
const defaultMiddlewareOptions: AuthMiddlewareOptions = {
  host: authHost,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  scopes,
  httpClient: fetch,
};

export function getCtpClientWithRefreshTokenFlow(refreshToken: string) {
  const refreshAuthMiddlewareOptions: RefreshAuthMiddlewareOptions = {
    ...defaultMiddlewareOptions,
    credentials: {
      ...defaultMiddlewareOptions.credentials,
    },
    refreshToken: refreshToken,
  };

  return (
    new ClientBuilder()
      .withRefreshTokenFlow(refreshAuthMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      // .withLoggerMiddleware()
      .build()
  );
}

export function getCtpClientCredentialsFlow() {
  return (
    new ClientBuilder()
      .withClientCredentialsFlow(defaultMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      // .withLoggerMiddleware(loggerMiddlewareOptions)
      .build()
  );
}

export function getCtpClientAnonymousFlow() {
  const anonymousAuthMiddlewareOptions: AuthMiddlewareOptions = {
    ...defaultMiddlewareOptions,
    credentials: {
      ...defaultMiddlewareOptions.credentials,
      anonymousId: getAnonymousId(),
    },
    tokenCache: tokenCacheStore,
  };

  return (
    new ClientBuilder()
      .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      // .withLoggerMiddleware()
      .build()
  );
}

export function getCtpClientPasswordFlow(currentUser: UserAuthOptions) {
  const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    ...defaultMiddlewareOptions,
    credentials: {
      ...defaultMiddlewareOptions.credentials,
      user: currentUser,
    },
    tokenCache: tokenCacheStore,
  };

  return (
    new ClientBuilder()
      .withPasswordFlow(passwordAuthMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      // .withLoggerMiddleware()
      .build()
  );
}
