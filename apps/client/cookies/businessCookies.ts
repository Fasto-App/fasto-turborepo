import { removeCookies, setCookie } from "cookies-next";

export const businessCookies = {
  token: "opentab-cookies-token",
  email: "opentab-cookies-email",
  name: "opentab-cookies-name"
} as const;

export const clearCookies = () => {
  removeCookies(businessCookies.token);
  removeCookies(businessCookies.name);
  removeCookies(businessCookies.email);
}

export const setCookies = (cookie: CookieKey, value: string) => {
  setCookie(businessCookies[cookie], value, {})
}

type CookieKey = keyof typeof businessCookies