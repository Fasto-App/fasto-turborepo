import { setCookie, getCookie, deleteCookie } from "cookies-next";

const cookiePrefix = "fasto-cl-"

export const setClientCookies = (cookie: string, value: string) => {
  setCookie(`${cookiePrefix}${cookie}`, value, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day
  })
}

export const getClientCookies = (cookie: string) => {
  return getCookie(`${cookiePrefix}${cookie}`)
}

export const clearClientCookies = (cookie: string) => {
  deleteCookie(`${cookiePrefix}${cookie}`);
}