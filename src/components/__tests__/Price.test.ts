import { expect, it } from 'vitest';
import { formatPrice } from '../../utils/price.ts';

it('formats price string', () =>
  expect(formatPrice(1234, 'EUR')).toBe('12.34 EUR'));
