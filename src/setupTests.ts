import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });
});
