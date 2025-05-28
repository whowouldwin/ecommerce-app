import { ProductProjection } from '@commercetools/platform-sdk';

export interface PriceInfo {
  originalPrice: number;
  discountedPrice?: number;
  currency: string;
}

export const extractPriceInfo = (product: ProductProjection): PriceInfo => {
  const price = product.masterVariant?.prices?.[0];
  return {
    originalPrice: price?.value?.centAmount ?? 0,
    discountedPrice: price?.discounted?.value?.centAmount,
    currency: price?.value?.currencyCode ?? 'USD',
  };
};

export const formatPrice = (amount: number, currency: string): string =>
  `${(amount / 100).toFixed(2)} ${currency}`;
