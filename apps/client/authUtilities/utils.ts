import { Locale } from "date-fns";
import es from "date-fns/locale/es";
import pt from "date-fns/locale/pt";

// TODO: deprecate
export const validateEmail = (email?: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// TODO: deprecate
export const validatePassword = (password: string) => password.length >= 6 &&
  password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)

const myLocales: Record<string, Locale> = {
  pt: pt,
  es: es,
}

export const getLocale = (locale?: string) => {
  if (!locale) return undefined

  return { locale: myLocales[locale] }
}
