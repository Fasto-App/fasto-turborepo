import { BusinessDashboard } from './../business-templates/Dashboard/BusinessDashboard';
// import the original type declarations
import "i18next";

import businessPayments from "../public/locales/en/businessPayments.json";
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
import customerSettings from "../public/locales/en/customerSettings.json";
import customerCart from "../public/locales/en/customerCart.json";
import common from "../public/locales/en/common.json";
import landingPage from "../public/locales/en/landingPage.json"
import customerPayment from "../public/locales/en/customerPayment.json";
import businessSubscriptions from "../public/locales/en/businessSubscriptions.json"
import businessDashboard from "../public/locales/en/businessDashboard.json"

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      customerCart: typeof customerCart;
      customerSettings: typeof customerSettings;
      customerCheckout: typeof customerCheckout;
      customerHome: typeof customerHome;
      customerProductDescription: typeof customerProductDescription;
      customerPayment: typeof customerPayment;
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
      businessPayments: typeof businessPayments;
      landingPage: typeof landingPage;
      businessSubscriptions: typeof businessSubscriptions;
      businessDashboard: typeof businessDashboard
    };
  }
}