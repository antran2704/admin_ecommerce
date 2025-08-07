import { IOrdersResponse } from "../interfaces";
import { IOrderTable } from "../interfaces/orderTable.interface";

export const transformOrdersResponseToTable = (
  data: IOrdersResponse[],
): IOrderTable[] => {
  if (!data) return [];

  const dataTable: IOrderTable[] = data.map((x: IOrdersResponse) => ({
    id: x.orderId,
    phoneNumber: x.shippingInfomation.phoneNumber,
    customerName: x.shippingInfomation.name,
    status: x.orderStatus,
    transactionStatus: x?.transaction?.status,
    totalPrice: x.totalPrice,
    createdAt: x.createdAt,
  }));

  return dataTable;
};
