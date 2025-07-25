import { TFunction } from "i18next";
import { ENUM_PRODUCT_STATUS } from "../enums";

const getProductStatusTitle = (
  t: TFunction<"VariantProductPage">,
  value: ENUM_PRODUCT_STATUS,
) => {
  switch (value) {
    case ENUM_PRODUCT_STATUS.ACTIVE:
      return t("status.active");
    case ENUM_PRODUCT_STATUS.INACTIVE:
      return t("status.inactive");
    default:
      return "";
  }
};

export { getProductStatusTitle };
