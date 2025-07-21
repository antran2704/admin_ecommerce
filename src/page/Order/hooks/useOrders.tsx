import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { initPagination } from "~/common/pagination";
import { parseQueryString } from "~/helper/url";
import { IResponseDataWithPagination } from "~/interface";
import { IPagination } from "~/interface/pagination";
import { IGetOrdersRequest, IOrdersResponse } from "../interfaces";
import { IOrderTable } from "../interfaces/orderTable.interface";
import { apiOrderService } from "~/api-client/order";

const useOrders = (query?: Partial<IGetOrdersRequest>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IOrdersResponse[]>([]);
  const [dataTable, setDataTabel] = useState<IOrderTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetData = async (paramater: Partial<IGetOrdersRequest>) => {
    setLoading(true);

    await apiOrderService
      .orders(paramater)
      .then(
        ({
          data,
          pagination,
        }: IResponseDataWithPagination<IOrdersResponse[]>) => {
          const dataTable: IOrderTable[] = data.map((x: IOrdersResponse) => ({
            id: x.orderId,
            phoneNumber: x.shippingInfomation.phoneNumber,
            customerName: x.shippingInfomation.name,
            status: x.orderStatus,
            totalPrice: x.totalPrice,
            createdAt: x.createdAt,
          }));

          setData(data);
          setDataTabel(dataTable);
          setPagination({
            page: pagination.page,
            take: pagination.take,
            total: pagination.total,
          });
        },
      )
      .catch((err) => err);

    setLoading(false);
  };

  useEffect(() => {
    if (!query) return;

    handleGetData(query);
  }, [query]);

  return {
    orders: data,
    orderTables: dataTable,
    handleGetOrders: handleGetData,
    onPaginationOrders: onPagination,
    paginationOrders: pagination,
    loadingOrders: loading,
  };
};

export default useOrders;
