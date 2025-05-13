export function getAnonymousId(): string {
  return 'anonymous-user-' + crypto.randomUUID();
}
