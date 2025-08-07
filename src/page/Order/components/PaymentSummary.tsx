import { useTranslation } from "react-i18next";
import CollapseGroup from "./Collapse";
import { formatBigNumber } from "~/helper/format";
import { VND_CURRENCY } from "~/common/currency";
import { IOrderResponse } from "../interfaces";

interface IProps {
  order: IOrderResponse;
}

export const OrderPaymentSummary = ({ order }: IProps) => {
  const { t } = useTranslation("OrderPage");

  return (
    <CollapseGroup label={t("paymentSummary")}>
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>{t("subtotal")}:</span>
          <span>
            {formatBigNumber(order?.totalPrice || 0)} {VND_CURRENCY}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
          <span>{t("total")}</span>
          <span>
            {formatBigNumber(order?.totalPrice || 0)} {VND_CURRENCY}
          </span>
        </div>
      </div>
    </CollapseGroup>
  );
};
