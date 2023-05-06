// import the original type declarations
import "i18next";

import businessOrders from "../public/locales/en/businessOrders.json";
import businessCheckout from "../public/locales/en/businessCheckout.json";
import businessAddToOrder from "../public/locales/en/businessAddToOrder.json";
import businessSettings from "../public/locales/en/businessSettings.json";
import businessTables from "../public/locales/en/businessTables.json";
import businessMenu from "../public/locales/en/businessMenu.json";
import businessCategoriesProducts from "../public/locales/en/businessCategoriesProducts.json";
import businessResetPassword from "../public/locales/en/businessResetPassword.json";
import businessForgotPassword from "../public/locales/en/businessForgotPassword.json";
import businessSignUp from "../public/locales/en/businessSignUp.json";
import businessCreateAccount from "../public/locales/en/businessCreateAccount.json";
import businessLogin from "../public/locales/en/businessLogin.json";
import customerCheckout from "../public/locales/en/customerCheckout.json";
import customerHome from "../public/locales/en/customerHome.json";
import customerProductDescription from "../public/locales/en/customerProductDescription.json";
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
      customerProductDescription: typeof customerProductDescription;
      businessLogin: typeof businessLogin;
      businessSignUp: typeof businessSignUp;
      businessCreateAccount: typeof businessCreateAccount;
      businessForgotPassword: typeof businessForgotPassword;
      businessResetPassword: typeof businessResetPassword;
      businessCategoriesProducts: typeof businessCategoriesProducts;
      businessMenu: typeof businessMenu;
      businessTables: typeof businessTables;
      businessSettings: typeof businessSettings;
      businessAddToOrder: typeof businessAddToOrder;
      businessCheckout: typeof businessCheckout;
      businessOrders: typeof businessOrders;
    };
  }
}