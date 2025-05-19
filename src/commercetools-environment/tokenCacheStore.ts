import { TokenCache, TokenStore } from '@commercetools/ts-client';
import { saveDataInLS } from '../services';
import { LocalStorageKey } from '../enums/appEnums.ts';

class TokenCacheStore implements TokenCache {
  private cache: TokenStore = {
    token: '',
    refreshToken: '',
    expirationTime: 0,
  };
  public clear() {
    this.cache = {
      token: '',
      refreshToken: '',
      expirationTime: 0,
    };
  }

  public get(): TokenStore {
    return this.cache;
  }

  public set(newTokenCache: TokenStore) {
    Object.assign(this.cache, newTokenCache);
    saveDataInLS(LocalStorageKey.SESSION, this.get());
  }
}

export const tokenCacheStore = new TokenCacheStore();
