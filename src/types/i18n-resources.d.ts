import "i18next";
import { lngResources } from "~/i18n";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: "Common";
    resources: (typeof lngResources)["en"];
  }
}
