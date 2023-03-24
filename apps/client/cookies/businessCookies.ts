import { removeCookies, setCookie, getCookie } from "cookies-next";

export const businessCookies = {
  token: "fasto-cookies-token",
  email: "fasto-cookies-email",
  name: "fasto-cookies-name"
} as const;

export const clientCookies = {
  token: "fasto-client-cookies-token",
  phoneNumber: "fasto-client-cookies-phoneNumber",
  name: "fasto-client-cookies-name",
  tab: "fasto-client-cookies-tab"
}

export const clearCookies = () => {
  removeCookies(businessCookies.token);
  removeCookies(businessCookies.name);
  removeCookies(businessCookies.email);
}

export const setCookies = (cookie: CookieKey, value: string) => {
  setCookie(businessCookies[cookie], value, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day
  })
}

export const getCookies = (cookie: CookieKey) => {
  return getCookie(businessCookies[cookie])
}

export const setClientCookies = (cookie: ClientCookieKey, value: string) => {
  setCookie(clientCookies[cookie], value, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day
  })
}

export const getClientCookies = (cookie: ClientCookieKey) => {
  return getCookie(clientCookies[cookie])
}

export const clearClientCookies = () => {
  removeCookies(clientCookies.token);
  removeCookies(clientCookies.name);
  removeCookies(clientCookies.phoneNumber);
}

type ClientCookieKey = keyof typeof clientCookies
type CookieKey = keyof typeof businessCookies