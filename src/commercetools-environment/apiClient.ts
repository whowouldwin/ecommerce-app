import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { Client } from '@commercetools/ts-client';
import {
  getCtpClientAnonymousFlow,
  getCtpClientCredentialsFlow,
  getCtpClientPasswordFlow,
  getCtpClientWithExistingTokenFlow,
  projectKey,
} from './ctpClient.ts';
import { getDataFromLS } from '../services';
import { AuthFlowType } from '../enums';

class ApiClient {
  private apiRoot;
  private ctpClient: Client;

  constructor() {
    // TODO заменить cookie
    this.ctpClient = this.makeCtpClient(
      getDataFromLS('session')
        ? AuthFlowType.EXISTING_TOKEN_FLOW
        : AuthFlowType.CREDENTIALS_FLOW,
    );

    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey(
      { projectKey: projectKey },
    );
  }

  getApiRoot() {
    return this.apiRoot;
  }

  changeApiRoot(
    authFlowType: AuthFlowType,
    // TODO type
    userCredentials?: {
      username: string;
      password: string;
    },
  ) {
    this.ctpClient = this.makeCtpClient(authFlowType, userCredentials);
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey(
      { projectKey: projectKey },
    );
  }

  makeCtpClient(
    authFlowType: AuthFlowType,
    // TODO type
    userCredentials?: {
      username: string;
      password: string;
    },
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
      case AuthFlowType.EXISTING_TOKEN_FLOW: {
        // TODO cookie
        const sessionData = getDataFromLS('session');
        if (sessionData !== null) {
          return getCtpClientWithExistingTokenFlow(
            `Bearer ${sessionData.token}`,
          ); // TODO replace 'here must be access token'
        }
        return this.makeCtpClient(AuthFlowType.CREDENTIALS_FLOW);
      }
    }
  }
}
//
export const apiClient = new ApiClient();
