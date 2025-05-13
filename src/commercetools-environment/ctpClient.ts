import {
  type AuthMiddlewareOptions,
  ClientBuilder,
  ExistingTokenMiddlewareOptions,
  type HttpMiddlewareOptions,
  LoggerMiddlewareOptions,
  MiddlewareResponse,
  PasswordAuthMiddlewareOptions,
  // RefreshAuthMiddlewareOptions,
} from '@commercetools/ts-client';
import { getAnonymousId } from '../utils/helpers.ts';
import { tokenCacheStore } from './tokenCacheStore.ts';

export const projectKey: string = import.meta.env.VITE_PROJECT_KEY;
export const clientId: string = import.meta.env.VITE_CLIENT_ID;
export const clientSecret: string = import.meta.env.VITE_CLIENT_SECRET;
export const authHost: string = import.meta.env.VITE_AUTH_HOST;
export const apiHost: string = import.meta.env.VITE_API_HOST;
export const scopes: string[] = [import.meta.env.VITE_SCOPE];

const loggerMiddlewareOptions: LoggerMiddlewareOptions = {
  loggerFn: (response: MiddlewareResponse) => {
    console.log('Response is: ', response);
  },
};
// TODO  Configure httpMiddlewareOptions
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

// TODO getCtpClientWithExistingTokenFlow поменять на refresh
export function getCtpClientWithExistingTokenFlow(existingAccessToken: string) {
  const existingTokenMiddlewareOptions: ExistingTokenMiddlewareOptions = {
    force: true,
  };

  return new ClientBuilder()
    .withExistingTokenFlow(existingAccessToken, existingTokenMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
//
// export function getCtpClientWithRefreshTokenFlow(refreshToken: string) {
//   const refreshAuthMiddlewareOptions: RefreshAuthMiddlewareOptions = {
//     ...defaultMiddlewareOptions,
//     credentials: {
//       ...defaultMiddlewareOptions.credentials
//     },
//     refreshToken: refreshToken,
//     tokenCache: tokenCacheStore,
//   };
//
//   return new ClientBuilder()
//     .withRefreshTokenFlow(refreshAuthMiddlewareOptions)
//     .withHttpMiddleware(httpMiddlewareOptions)
//     .withLoggerMiddleware()
//     .build();
// }

export function getCtpClientCredentialsFlow() {
  // const clientCredentialsAuthMiddlewareOptions: AuthMiddlewareOptions = defaultMiddlewareOptions;

  return new ClientBuilder()
    .withClientCredentialsFlow(defaultMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware(loggerMiddlewareOptions)
    .build();
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

  return new ClientBuilder()
    .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}

export function getCtpClientPasswordFlow(currentUser: {
  // TODO currentUser in interface
  username: string;
  password: string;
}) {
  const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    ...defaultMiddlewareOptions,
    credentials: {
      ...defaultMiddlewareOptions.credentials,
      user: currentUser,
    },
    tokenCache: tokenCacheStore,
  };

  return new ClientBuilder()
    .withPasswordFlow(passwordAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
