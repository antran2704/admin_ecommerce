import { useQuery } from "@tanstack/react-query";

import { IOrderResponse } from "../interfaces";
import { apiOrderService } from "~/api-client/order";
import { TQueryOptions } from "~/interface/reactQuery";
import { QUERY_KEY } from "~/constants/queryKey";
import { IErrorResponse } from "~/interface";

export const useOrder = (
  orderId: string,
  options?: TQueryOptions<IOrderResponse>,
) => {
  const query = useQuery<IOrderResponse, IErrorResponse>({
    queryKey: [QUERY_KEY.ORDER, orderId],
    queryFn: () => apiOrderService.order(orderId),
    ...options,
    enabled: !!orderId,
    retry: false,
  });

  return query;
};
