export enum AuthFlowType {
  'ANONYMOUS_FLOW',
  'CREDENTIALS_FLOW',
  'PASSWORD_FLOW',
  'REFRESH_TOKEN_FLOW',
}

export enum LocalStorageKey {
  SESSION = 'session',
}

export enum RequestStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  FAILED = 'failed',
}
