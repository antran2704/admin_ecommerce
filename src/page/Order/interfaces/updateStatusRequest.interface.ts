import { ENUM_CANCELLATION_REASON, ENUM_ORDER_STATUS } from "../enums";

export interface IUpdateOrderStatusRequest {
  orderId: string;
  status: ENUM_ORDER_STATUS;
  reason?: ENUM_CANCELLATION_REASON;
  otherReason?: string;
}
