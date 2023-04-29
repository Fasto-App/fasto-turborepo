// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import businessSignUp from "../public/locales/en/businessSignUp.json";
import businessCreateAccount from "../public/locales/en/businessCreateAccount.json";
import businessLogin from "../public/locales/en/businessLogin.json";
import clientCheckout from "../public/locales/en/clientCheckout.json";
import clientHome from "../public/locales/en/clientHome.json";
import common from "../public/locales/en/common.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      clientCheckout: typeof clientCheckout;
      clientHome: typeof clientHome;
      businessLogin: typeof businessLogin;
      businessCreateAccount: typeof businessCreateAccount;
      businessSignUp: typeof businessSignUp;
    };
  }
}