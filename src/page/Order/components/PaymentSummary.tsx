import { useTranslation } from "react-i18next";
import CollapseGroup from "./Collapse";

export const OrderPaymentSummary = () => {
  const { t } = useTranslation("OrderPage");

  return (
    <CollapseGroup label={t("paymentSummary")}>
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>{t("subtotal")}:</span>
          <span>10000</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
          <span>{t("total")}</span>
          <span>1000</span>
        </div>
      </div>
    </CollapseGroup>
  );
};
