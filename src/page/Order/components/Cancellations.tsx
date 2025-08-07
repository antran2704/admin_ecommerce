import { useTranslation } from "react-i18next";

import Collapse from "./Collapse";
import CancellationItem from "./CancellationItem";
import { IOrderResponse } from "../interfaces";

interface IProps {
  order: IOrderResponse;
}

export const OrderCancellations = ({ order }: IProps) => {
  const { t: tOrder } = useTranslation("OrderPage");

  const { cancellations } = order || {};

  return (
    <Collapse
      label={tOrder("cancellation.title")}
      collapseItemProps={{
        headerClass: "!text-red-500",
      }}
    >
      <div className="flex flex-col gap-5">
        {cancellations?.map((item, index) => (
          <CancellationItem key={item.id} item={item} showBorder={index > 0} />
        ))}
      </div>
    </Collapse>
  );
};
