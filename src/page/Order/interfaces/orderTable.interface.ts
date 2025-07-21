import { ENUM_ORDER_STATUS } from "../enums";

export interface IOrderTable {
  id: string;
  totalPrice: number;
  status: ENUM_ORDER_STATUS;
  customerName: string;
  phoneNumber: string;
  createdAt: string;
}
