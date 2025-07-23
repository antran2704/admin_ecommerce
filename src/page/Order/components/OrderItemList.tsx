import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Empty, Pagination } from "antd";
import { useParams } from "react-router-dom";

import CollapseGroup from "./Collapse";
import { useOrderItems } from "../hooks";
import { IGetOrderItemsRequest } from "../interfaces";
import { EOrderType } from "~/enum/paramater";
import { OrderItem } from "./OrderItem";
import { OrderItemSkelaton } from "./OrderItemSkelaton";
import MESSAGE_ERROR from "~/common/errorMessage";

export const OrderItemList = () => {
  const { t } = useTranslation("OrderPage");
  const { t: tError } = useTranslation("Error");

  const { order_id } = useParams();
  const [params, setParams] = useState<IGetOrderItemsRequest>({
    orderId: order_id,
    order: EOrderType.DESC,
    page: 1,
    take: 10,
  });
  const { data, isFetching } = useOrderItems(params);

  return (
    <CollapseGroup label={t("orderItems")}>
      <div className="flex flex-col gap-5">
        {data?.data.map((item) => (
          <OrderItem key={item.orderItemId} item={item} />
        ))}

        {isFetching &&
          [...Array(3)].map((_, index) => <OrderItemSkelaton key={index} />)}
      </div>

      {data?.pagination && data?.pagination.total > params.take && (
        <Pagination
          className="mt-5"
          align="center"
          pageSize={data?.pagination.take}
          current={data?.pagination.page}
          total={data?.pagination.total}
          onChange={(page) => setParams({ ...params, page })}
        />
      )}

      {!isFetching && !data?.data.length && (
        <Empty description={tError(MESSAGE_ERROR.NO_DATA)} />
      )}
    </CollapseGroup>
  );
};
