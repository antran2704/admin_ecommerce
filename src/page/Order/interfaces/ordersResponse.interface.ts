import { ITransactionResponse } from "~/interface/transaction";
import { ENUM_ORDER_STATUS } from "../enums";
import { IOrderShippingInfoResponse } from "./shippingInfoResponse.interface";

export interface IOrdersResponse {
  orderId: string;
  totalPrice: number;
  orderStatus: ENUM_ORDER_STATUS;
  shippingInfomation: IOrderShippingInfoResponse;
  transaction: ITransactionResponse;
  createdAt: string;
}
