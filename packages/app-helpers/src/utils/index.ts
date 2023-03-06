export const typedKeys = <T extends {}>(obj?: T) => Object.keys(obj ?? {}) as Array<keyof T>
export const typedValues = <T extends {}>(obj?: T) => Object.values(obj ?? {}) as Array<T[keyof T]>

// Define the fixed-point factor
export const FIXED_POINT_FACTOR_PERCENTAGE = 10000;
export const FIXED_POINT_FACTOR = 100;

export const parseToCurrency = (number?: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format((number ?? 0) / FIXED_POINT_FACTOR);
}

export function formatAsPercentage(num?: number | null) {
  // the number to be converted to a percentage will be multiplied by 100
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format((num ?? 0) / FIXED_POINT_FACTOR_PERCENTAGE);
}

// a function that takes the percentage value and returns the fixed-point value
export const parseToFixedPoint = (percentage?: number) => {
  return (percentage ?? 0) / FIXED_POINT_FACTOR_PERCENTAGE;
}

// get percentage of a value
export const getPercentageOfValue = (value?: number, percentage?: number) => {
  return ((value ?? 0) * ((percentage ?? 0) / FIXED_POINT_FACTOR_PERCENTAGE));
}

// get the percentage value with the fixed-point value
export const getFixedPointPercentage = (percentage?: number) => {
  return ((percentage ?? 0) * FIXED_POINT_FACTOR_PERCENTAGE);
}