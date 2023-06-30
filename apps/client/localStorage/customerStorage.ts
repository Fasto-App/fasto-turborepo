export const getCustomerName = () => {
  return localStorage.getItem("customerName");
}

export const setCustomerName = (customerName: string) => {
  localStorage.setItem("customerName", customerName);
}

export const getCustomerPhone = () => {
  return localStorage.getItem("customerPhone");
}

export const setCustomerPhone = (customerPhone: string) => {
  localStorage.setItem("customerPhone", customerPhone);
}
