export const parseToCurrency = (number?: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.floor(number ?? 0) / 100);
}