import { TokenStore } from '@commercetools/ts-client';

export function saveDataInLS(key: string, data: TokenStore) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getDataFromLS(key: string): TokenStore | null {
  const result = localStorage.getItem(key);
  return result ? JSON.parse(result) : null;
}

export function removeDataFromLS(key: string) {
  localStorage.removeItem(key);
}
