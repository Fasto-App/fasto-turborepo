import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const businessCookies = {
  token: "fasto-business-cookies-token",
} as const;

export const clearBusinessCookies = () => {
  deleteCookie(businessCookies.token);
}

export const setBusinessCookies = (cookie: BusinessCookieKey, value: string) => {
  setCookie(businessCookies[cookie], value, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day
  })
}

export const getBusinessCookies = (cookie: BusinessCookieKey) => {
  return getCookie(businessCookies[cookie])
}
type BusinessCookieKey = keyof typeof businessCookies