import { describe, it, expect } from 'vitest';
import type { TokenStore } from '@commercetools/ts-client';
import { removeDataFromLS, saveDataInLS } from '../../services';

const testKey = 'testToken';
const mockToken: TokenStore = {
  token: 'abc',
  expirationTime: 5555555555,
  refreshToken: 'refresh-abc',
};

describe('localStorage utils', () => {
  it('saves data to localStorage', () => {
    saveDataInLS(testKey, mockToken);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      testKey,
      JSON.stringify(mockToken),
    );
  });

  it('removes data from localStorage', () => {
    removeDataFromLS(testKey);
    expect(localStorage.removeItem).toHaveBeenCalledWith(testKey);
  });
});
