import { useTranslation } from "react-i18next";

export const OrderItemList = () => {
  const { t } = useTranslation("OrderPage");

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-200">
      <div className="flex items-center text-orange-700 mb-4">
        <span className="font-semibold">{t("orderItems")}</span>
      </div>
    </div>
  );
};
