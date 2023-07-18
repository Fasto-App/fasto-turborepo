export const typedKeys = <T extends {}>(obj?: T) => Object.keys(obj ?? {}) as Array<keyof T>
export const typedValues = <T extends {}>(obj?: T) => Object.values(obj ?? {}) as Array<T[keyof T]>

// Define the fixed-point factor
export const FIXED_POINT_FACTOR_PERCENTAGE = 10000;
const FIXED_POINT_FACTOR_CURRENCY = 100;

export const parseToCurrency = (number?: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.floor(number ?? 0) / FIXED_POINT_FACTOR_CURRENCY);
}

export function formatAsPercentage(num?: number | null) {
  // the number to be converted to a percentage will be multiplied by 100
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.floor(num ?? 0) / FIXED_POINT_FACTOR_PERCENTAGE);
}

// a function that takes the percentage value and returns the fixed-point value
export const parseToFixedPoint = (percentage?: number) => {
  return Math.floor(percentage ?? 0) / FIXED_POINT_FACTOR_PERCENTAGE;
}

// get percentage of a value
export const getPercentageOfValue = (value?: number, percentage?: number) => {
  return (Math.floor((value ?? 0) * ((percentage ?? 0)) / FIXED_POINT_FACTOR_PERCENTAGE));
}

// get the percentage value with the fixed-point value
export const getFixedPointPercentage = (part: number, total: number) => {
  return part * FIXED_POINT_FACTOR_PERCENTAGE / total;
}

export const DICE_BEAR_INITIALS_URL = (name: string) => `https://api.dicebear.com/5.x/initials/svg?seed=${name}`

export const PRODUCT_PLACEHOLDER_IMAGE = "https://canape.cdnflexcatering.com/themes/frontend/default/images/img-placeholder.png"

export const locales = ['en', 'pt', 'es'] as const
export const localeFlags = {
  en: '🇺🇸  EN',
  pt: '🇧🇷  PT',
  es: '🇪🇸  ES',
} as const

export type Locale = typeof locales[number]

export const localeObj = locales.map(locale => {
  return {
    _id: locale,
    value: localeFlags[locale]
  }
})