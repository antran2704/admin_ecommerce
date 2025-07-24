import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { CiCalendar } from "react-icons/ci";

import { IOrderResponse } from "../interfaces";
import { OrderStatus } from "./Status";
import { DAY_DYHM } from "~/common/format";
import { OrderStatusDropdown } from "./StatusDropdown";
import { ENUM_ORDER_STATUS } from "../enums";

interface IProps {
  order: IOrderResponse;
  isEditable?: boolean;
}

export const OrderHeader = ({ order, isEditable = false }: IProps) => {
  const { t } = useTranslation("OrderPage");

  const isShowDropdown =
    order?.orderStatus !== ENUM_ORDER_STATUS.COMPLETED &&
    order?.orderStatus !== ENUM_ORDER_STATUS.CANCELLED;

  return (
    <div className="flex items-center flex-wrap justify-between gap-5">
      <div className="flex items-center flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-900">
          {t("order")} #{order?.orderId}
        </h2>
        <OrderStatus
          status={order?.orderStatus}
          tagProps={{ className: "text-sm" }}
        />
        <div className="flex items-center text-gray-500 text-sm gap-2">
          <CiCalendar className="size-5" />
          <span className="text-base">
            {order?.createdAt && dayjs(order?.createdAt).format(DAY_DYHM)}
          </span>
        </div>
      </div>

      {isShowDropdown && (
        <OrderStatusDropdown order={order} isEditable={isEditable} />
      )}
    </div>
  );
};
