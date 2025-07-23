import dayjs from "dayjs";
import { useMemo } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { ENUM_CANCELLATION_REASON } from "../enums";
import { IOrderCancellationResponse } from "../interfaces";
import { ENUM_USER_TYPE } from "~/enum/user";
import { DAY_DYHMS } from "~/common/format";

interface IProps {
  item: IOrderCancellationResponse;
  showBorder?: boolean;
}

const CancellationItem = ({ item, showBorder = false }: IProps) => {
  const { t: tOrder, i18n } = useTranslation("OrderPage");
  const { t: tCommon } = useTranslation("Common");

  const reasonContent = useMemo(
    () => ({
      [ENUM_CANCELLATION_REASON.CUSTOMER_CHANGED_MIND]: tOrder(
        "reason.customerChange",
      ),
      [ENUM_CANCELLATION_REASON.OUT_OF_STOCK]: tOrder("reason.outOfStock"),
      [ENUM_CANCELLATION_REASON.OTHER]: tOrder("reason.other"),
    }),
    [item, i18n.resolvedLanguage],
  );

  return (
    <div className={clsx({ "border-t border-gray-200 pt-5": showBorder })}>
      <p>
        <span className="font-medium">
          {tOrder("cancellation.cancelledBy")}:
        </span>{" "}
        {item.cancelledByType === ENUM_USER_TYPE.USER
          ? tCommon("userType.customer")
          : tCommon("userType.admin")}
      </p>
      <p>
        <span className="font-medium">
          {tOrder("cancellation.cancelledAt")}:
        </span>{" "}
        {dayjs(item.createdAt).format(DAY_DYHMS)}
      </p>
      <p>
        <span className="font-medium">{tOrder("cancellation.reason")}:</span>{" "}
        {reasonContent[item.reason]}
      </p>
      {item.reason === ENUM_CANCELLATION_REASON.OTHER && (
        <p>
          <span className="font-medium">
            {tOrder("cancellation.description")}:
          </span>{" "}
          {item.otherReason}
        </p>
      )}
    </div>
  );
};

export default CancellationItem;
