import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { Client, TokenStore, UserAuthOptions } from '@commercetools/ts-client';
import {
  getCtpClientAnonymousFlow,
  getCtpClientCredentialsFlow,
  getCtpClientPasswordFlow,
  getCtpClientWithRefreshTokenFlow,
  projectKey,
} from './ctpClient.ts';
import { getDataFromLS } from '../services';
import { AuthFlowType, LocalStorageKey } from '../enums';

class ApiClient {
  private apiRoot: ByProjectKeyRequestBuilder;
  private ctpClient: Client;

  constructor() {
    this.ctpClient = this.makeCtpClient(
      getDataFromLS(LocalStorageKey.SESSION)
        ? AuthFlowType.REFRESH_TOKEN_FLOW
        : AuthFlowType.CREDENTIALS_FLOW,
    );

    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey(
      { projectKey: projectKey },
    );
  }

  getApiRoot(): ByProjectKeyRequestBuilder {
    return this.apiRoot;
  }

  changeApiRoot(authFlowType: AuthFlowType, userCredentials?: UserAuthOptions) {
    this.ctpClient = this.makeCtpClient(authFlowType, userCredentials);
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey(
      { projectKey: projectKey },
    );
  }

  makeCtpClient(
    authFlowType: AuthFlowType,
    userCredentials?: UserAuthOptions,
  ): Client {
    switch (authFlowType) {
      case AuthFlowType.ANONYMOUS_FLOW: {
        return getCtpClientAnonymousFlow();
      }
      case AuthFlowType.PASSWORD_FLOW: {
        if (userCredentials) {
          return getCtpClientPasswordFlow(userCredentials);
        }
        return (
          this.ctpClient || this.makeCtpClient(AuthFlowType.CREDENTIALS_FLOW)
        );
      }
      case AuthFlowType.CREDENTIALS_FLOW: {
        return getCtpClientCredentialsFlow();
      }
      case AuthFlowType.REFRESH_TOKEN_FLOW: {
        const sessionData: TokenStore | null = getDataFromLS(
          LocalStorageKey.SESSION,
        );
        if (sessionData !== null && sessionData.refreshToken) {
          return getCtpClientWithRefreshTokenFlow(sessionData.refreshToken);
        }
        return this.makeCtpClient(AuthFlowType.CREDENTIALS_FLOW);
      }
    }
  }
}

export const apiClient = new ApiClient();
