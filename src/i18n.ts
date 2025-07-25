import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import resourceEn from "@assets/locales/en/translation.json";
import resourceVi from "@assets/locales/vi/translation.json";

// Login Page
import loginPageVi from "@assets/locales/vi/loginPage.json";
import loginPageEn from "@assets/locales/en/loginPage.json";

// Forgot Password Page
import forgotPasswordPageVi from "@assets/locales/vi/forgotPasswordPage.json";
import forgotPasswordPageEn from "@assets/locales/en/forgotPasswordPage.json";

// Confirm Otp Page
import confirmOtpPageVi from "@assets/locales/vi/confirmOtpPage.json";
import confirmOtpPageEn from "@assets/locales/en/confirmOtpPage.json";

// Staff Page
import staffPageVi from "@assets/locales/vi/staffPage.json";
import staffPageEn from "@assets/locales/en/staffPage.json";

// User Page
import userPageVi from "@assets/locales/vi/userPage.json";
import userPageEn from "@assets/locales/en/userPage.json";

// Category Page
import categoryPageVi from "@assets/locales/vi/categoryPage.json";
import categoryPageEn from "@assets/locales/en/categoryPage.json";

// Permission Page
import permissionPageVi from "@assets/locales/vi/permissionPage.json";
import permissionPageEn from "@assets/locales/en/permissionPage.json";

// Home Page
import homePageVi from "@assets/locales/vi/homePage.json";
import homePageEn from "@assets/locales/en/homePage.json";

// Account Page
import accountPageVi from "@assets/locales/vi/accountPage.json";
import accountPageEn from "@assets/locales/en/accountPage.json";

// Variant Type Page
import variantTypePageVi from "@assets/locales/vi/variantTypePage.json";
import variantTypePageEn from "@assets/locales/en/variantTypePage.json";

// Variant Type Value Page
import variantTypeValuePageVi from "@assets/locales/vi/variantTypeValuesPage.json";
import variantTypeValuePageEn from "@assets/locales/en/variantTypeValuesPage.json";

// Product Page
import productPageVi from "@assets/locales/vi/productPage.json";
import productPageEn from "@assets/locales/en/productPage.json";

// Variant Product Page
import variantProductPageVi from "@assets/locales/vi/variantProductPage.json";
import variantProductPageEn from "@assets/locales/en/variantProductPage.json";

// Order Page
import orderPageVi from "@assets/locales/vi/orderPage.json";
import orderPageEn from "@assets/locales/en/orderPage.json";

// Sidebar
import sidebarVi from "@assets/locales/vi/sidebar.json";
import sidebarEn from "@assets/locales/en/sidebar.json";

// Navbar
import navbarVi from "@assets/locales/vi/navbar.json";
import navbarEn from "@assets/locales/en/navbar.json";

// Permission
import permissionEn from "@assets/locales/en/permission.json";
import permissionVi from "@assets/locales/vi/permission.json";

// Common
import commonEn from "@assets/locales/en/common.json";
import commonVi from "@assets/locales/vi/common.json";

// Error
import errorEn from "@assets/locales/en/error.json";
import errorVi from "@assets/locales/vi/error.json";

// Success
import successEn from "@assets/locales/en/success.json";
import successVi from "@assets/locales/vi/success.json";

// Filter
import filterEn from "@assets/locales/en/filter.json";
import filterVi from "@assets/locales/vi/filter.json";

export const lngResources = {
  en: {
    ...resourceEn,
    LoginPage: loginPageEn,
    ForgotPasswordPage: forgotPasswordPageEn,
    ConfirmOtpPage: confirmOtpPageEn,
    StaffPage: staffPageEn,
    UserPage: userPageEn,
    CategoryPage: categoryPageEn,
    PermissionPage: permissionPageEn,
    HomePage: homePageEn,
    AccountPage: accountPageEn,
    VariantTypePage: variantTypePageEn,
    VariantTypeValuePage: variantTypeValuePageEn,
    ProductPage: productPageEn,
    VariantProductPage: variantProductPageEn,
    OrderPage: orderPageEn,
    Permission: permissionEn,
    Sidebar: sidebarEn,
    Navbar: navbarEn,
    Common: commonEn,
    Error: errorEn,
    Success: successEn,
    Filter: filterEn,
  } as const,
  vi: {
    ...resourceVi,
    LoginPage: loginPageVi,
    ForgotPasswordPage: forgotPasswordPageVi,
    ConfirmOtpPage: confirmOtpPageVi,
    StaffPage: staffPageVi,
    UserPage: userPageVi,
    CategoryPage: categoryPageVi,
    PermissionPage: permissionPageVi,
    HomePage: homePageVi,
    AccountPage: accountPageVi,
    VariantTypePage: variantTypePageVi,
    VariantTypeValuePage: variantTypeValuePageVi,
    ProductPage: productPageVi,
    VariantProductPage: variantProductPageVi,
    OrderPage: orderPageVi,
    Permission: permissionVi,
    Sidebar: sidebarVi,
    Navbar: navbarVi,
    Common: commonVi,
    Error: errorVi,
    Success: successVi,
    Filter: filterVi,
  } as const,
} as const;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "vi",
    debug: false,
    interpolation: {
      escapeValue: false,
      skipOnVariables: false,
    },
    resources: lngResources,
    defaultNS: "Common",
  });

export default i18n;
