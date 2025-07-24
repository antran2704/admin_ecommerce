import { ENUM_ORDER_STATUS } from "../enums";
import { IOrderCancellationResponse } from "./orderCancellationResponse.interface";
import { IOrderShippingInfoResponse } from "./shippingInfoResponse.interface";

export interface IOrderResponse {
  orderId: string;
  totalPrice: number;
  orderStatus: ENUM_ORDER_STATUS;
  shippingInfomation: IOrderShippingInfoResponse;
  note: string;
  cancellations: IOrderCancellationResponse[];
  user: {
    id: string;
    email: string;
  };
  createdAt: string;
}
