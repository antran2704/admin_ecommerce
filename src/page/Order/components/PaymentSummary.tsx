import { useTranslation } from "react-i18next";

export const OrderPaymentSummary = () => {
  const { t } = useTranslation("OrderPage");

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {t("paymentSummary")}
      </h3>
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
    </div>
  );
};
