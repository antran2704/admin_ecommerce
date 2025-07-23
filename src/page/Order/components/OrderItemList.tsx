import { useTranslation } from "react-i18next";
import CollapseGroup from "./Collapse";

export const OrderItemList = () => {
  const { t } = useTranslation("OrderPage");

  return <CollapseGroup label={t("orderItems")}></CollapseGroup>;
};
