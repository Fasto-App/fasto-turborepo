export const typedKeys = <T extends {}>(obj?: T) => Object.keys(obj ?? {}) as Array<keyof T>
export const typedValues = <T extends {}>(obj?: T) => Object.values(obj ?? {}) as Array<T[keyof T]>

export function formatAsPercentage(num?: number | null) {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format((num ?? 0));
}