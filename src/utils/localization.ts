import { LocalizedString } from '@commercetools/platform-sdk';

export const getLocalizedText = (
  text?: LocalizedString,
  locale: string = 'en-US',
): string => {
  return (
    text?.[locale] ||
    text?.['en-US'] ||
    Object.values(text || {})[0] ||
    'Unnamed'
  );
};
