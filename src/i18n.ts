import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import resourceEn from "@assets/locales/en/translation.json";
import resourceVi from "@assets/locales/vi/translation.json";

// Staff Page
import staffPageVi from "@assets/locales/vi/staffPage.json";
import staffPageEn from "@assets/locales/en/staffPage.json";

// Permission Page
import permissionPageVi from "@assets/locales/vi/permissionPage.json";
import permissionPageEn from "@assets/locales/en/permissionPage.json";

// Home Page
import homePageVi from "@assets/locales/vi/homePage.json";
import homePageEn from "@assets/locales/en/homePage.json";

// Account Page
import accountPageVi from "@assets/locales/vi/accountPage.json";
import accountPageEn from "@assets/locales/en/accountPage.json";

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

const resources = {
  en: {
    ...resourceEn,
    StaffPage: staffPageEn,
    PermissionPage: permissionPageEn,
    HomePage: homePageEn,
    AccountPage: accountPageEn,
    Permission: permissionEn,
    Sidebar: sidebarEn,
    Navbar: navbarEn,
    Common: commonEn,
    Error: errorEn,
    Success: successEn,
    Filter: filterEn,
  },
  vi: {
    ...resourceVi,
    StaffPage: staffPageVi,
    PermissionPage: permissionPageVi,
    HomePage: homePageVi,
    AccountPage: accountPageVi,
    Permission: permissionVi,
    Sidebar: sidebarVi,
    Navbar: navbarVi,
    Common: commonVi,
    Error: errorVi,
    Success: successVi,
    Filter: filterVi,
  },
};

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
    resources,
  });

export default i18n;
