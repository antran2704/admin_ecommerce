import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { apiOrderService } from "~/api-client/order";
import { QUERY_KEY } from "~/constants/queryKey";
import { IGetOrderItemsRequest, IOrderItemResponse } from "../interfaces";
import { TQueryOptions } from "~/interface/reactQuery";
import { IErrorResponse, IResponseDataWithPagination } from "~/interface";
import { parseQueryString } from "~/helper/url";

export const useOrderItems = (
  paramater: Partial<IGetOrderItemsRequest>,
  options?: TQueryOptions<IResponseDataWithPagination<IOrderItemResponse[]>>,
) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const query = useQuery<
    IResponseDataWithPagination<IOrderItemResponse[]>,
    IErrorResponse
  >({
    queryKey: [QUERY_KEY.ORDER_ITEMS, paramater],
    queryFn: () => apiOrderService.orderItems(paramater),
    ...options,
    enabled: !!paramater?.orderId,
  });

  return {
    ...query,
    onPaginationOrderItems: onPagination,
  };
};
