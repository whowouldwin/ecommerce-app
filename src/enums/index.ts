export enum AuthFlowType {
  'ANONYMOUS_FLOW',
  'CREDENTIALS_FLOW',
  'PASSWORD_FLOW',
  'REFRESH_TOKEN_FLOW',
}

export enum LocalStorageKey {
  SESSION = 'session',
}

export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Failed = 'failed',
}
