import { TFunction } from "i18next";
import { ENUM_ORDER_STATUS } from "../enums";

const getOrderStatusTitle = (
  t: TFunction<"OrderPage">,
  value: ENUM_ORDER_STATUS,
) => {
  switch (value) {
    case ENUM_ORDER_STATUS.PENDING:
      return t("status.pending");
    case ENUM_ORDER_STATUS.PROCESSING:
      return t("status.processing");
    case ENUM_ORDER_STATUS.CANCELLED:
      return t("status.cancelled");
    case ENUM_ORDER_STATUS.COMPLETED:
      return t("status.completed");
    default:
      return "";
  }
};

export { getOrderStatusTitle };
