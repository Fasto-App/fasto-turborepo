export const typedKeys = <T extends {}>(obj?: T) => Object.keys(obj ?? {}) as Array<keyof T>
export const typedValues = <T extends {}>(obj?: T) => Object.values(obj ?? {}) as Array<T[keyof T]>