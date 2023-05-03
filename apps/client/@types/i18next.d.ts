// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import businessResetPassword from "../public/locales/en/businessResetPassword.json";
import businessForgotPassword from "../public/locales/en/businessForgotPassword.json";
import businessSignUp from "../public/locales/en/businessSignUp.json";
import businessCreateAccount from "../public/locales/en/businessCreateAccount.json";
import businessLogin from "../public/locales/en/businessLogin.json";
import customerCheckout from "../public/locales/en/customerCheckout.json";
import customerHome from "../public/locales/en/customerHome.json";
import common from "../public/locales/en/common.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      customerCheckout: typeof customerCheckout;
      customerHome: typeof customerHome;
      businessLogin: typeof businessLogin;
      businessSignUp: typeof businessSignUp;
      businessCreateAccount: typeof businessCreateAccount;
      businessForgotPassword: typeof businessForgotPassword;
      businessResetPassword: typeof businessResetPassword;
    };
  }
}