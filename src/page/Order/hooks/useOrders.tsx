import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { parseQueryString } from "~/helper/url";
import { IGetOrdersRequest, IOrdersResponse } from "../interfaces";
import { apiOrderService } from "~/api-client/order";
import { TQueryOptions } from "~/interface/reactQuery";
import { QUERY_KEY } from "~/constants/queryKey";
import { IErrorResponse, IResponseDataWithPagination } from "~/interface";
import { IOrderTable } from "../interfaces/orderTable.interface";
import { transformOrdersResponseToTable } from "../transforms";

const useOrders = (
  paramater?: Partial<IGetOrdersRequest>,
  options?: TQueryOptions<IResponseDataWithPagination<IOrdersResponse[]>>,
) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [dataTable, setDataTabel] = useState<IOrderTable[]>([]);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...paramater, page, take }));
  };

  const query = useQuery<
    IResponseDataWithPagination<IOrdersResponse[]>,
    IErrorResponse
  >({
    queryKey: [QUERY_KEY.ORDERS, paramater],
    queryFn: () => apiOrderService.orders(paramater),
    ...options,
  });

  useEffect(() => {
    if (!query.data) {
      setDataTabel([]);
      return;
    }

    setDataTabel(transformOrdersResponseToTable(query.data.data));
  }, [query.data]);

  return {
    ...query,
    orderTables: dataTable,
    onPaginationOrders: onPagination,
  };
};

export default useOrders;
