import { setCookie, getCookie, deleteCookie } from "cookies-next";

const cookiePrefix = "fasto-cl-"

export const setClientCookies = (businessId: string, value: string) => {
  setCookie(`${cookiePrefix}${businessId}`, value, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day
  })
}

export const getClientCookies = (businessId: string) => {
  return getCookie(`${cookiePrefix}${businessId}`)
}

export const clearClientCookies = (businessId: string) => {
  deleteCookie(`${cookiePrefix}${businessId}`);
}